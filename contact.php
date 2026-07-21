<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');

const MAX_REQUEST_BYTES = 65536;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_COUNTRY_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 4000;
const MIN_MESSAGE_LENGTH = 20;
const MAX_SOURCE_PAGE_LENGTH = 500;
const MAX_PAGE_TITLE_LENGTH = 300;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 900;

function respond(
    int $status,
    bool $success,
    string $message,
    array $additionalData = []
): never {
    http_response_code($status);

    echo json_encode(
        array_merge(
            [
                'success' => $success,
                'message' => $message,
            ],
            $additionalData
        ),
        JSON_UNESCAPED_SLASHES |
            JSON_UNESCAPED_UNICODE |
            JSON_INVALID_UTF8_SUBSTITUTE
    );

    exit;
}

function stringLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

function textField(array $data, string $key): string
{
    $value = $data[$key] ?? '';

    if (!is_string($value)) {
        return '';
    }

    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = strip_tags($value);

    return trim($value);
}

function singleLine(string $value): string
{
    $value = preg_replace('/[\r\n\t]+/u', ' ', $value) ?? '';
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';

    return trim($value);
}

function normalizeMessage(string $value): string
{
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[^\P{C}\n\t]/u', '', $value) ?? '';
    $value = preg_replace("/\n{4,}/u", "\n\n\n", $value) ?? '';

    return trim($value);
}

function requestIdentifier(): string
{
    try {
        return bin2hex(random_bytes(8));
    } catch (Throwable $exception) {
        return substr(
            hash(
                'sha256',
                uniqid('', true) . microtime(true)
            ),
            0,
            16
        );
    }
}

function requestIpAddress(): string
{
    $value = $_SERVER['REMOTE_ADDR'] ?? '';

    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);

    if (!filter_var($value, FILTER_VALIDATE_IP)) {
        return '';
    }

    return $value;
}

function validateRequestMethod(): void
{
    $method = strtoupper(
        (string) ($_SERVER['REQUEST_METHOD'] ?? '')
    );

    if ($method !== 'POST') {
        header('Allow: POST');

        respond(
            405,
            false,
            'Only POST requests are accepted.'
        );
    }
}

function validateRequestSize(): void
{
    $contentLength = $_SERVER['CONTENT_LENGTH'] ?? null;

    if (
        $contentLength !== null &&
        is_numeric($contentLength) &&
        (int) $contentLength > MAX_REQUEST_BYTES
    ) {
        respond(
            413,
            false,
            'The submitted request is too large.'
        );
    }
}

function validateContentType(): void
{
    $contentType = strtolower(
        (string) ($_SERVER['CONTENT_TYPE'] ?? '')
    );

    if ($contentType === '') {
        return;
    }

    $allowedTypes = [
        'multipart/form-data',
        'application/x-www-form-urlencoded',
    ];

    foreach ($allowedTypes as $allowedType) {
        if (str_starts_with($contentType, $allowedType)) {
            return;
        }
    }

    respond(
        415,
        false,
        'The submitted request format is not supported.'
    );
}

function normalizeHost(string $host): string
{
    $host = strtolower(trim($host));
    $host = preg_replace('/:\d+$/', '', $host) ?? $host;

    if (str_starts_with($host, 'www.')) {
        $host = substr($host, 4);
    }

    return $host;
}

function validateSameOrigin(): void
{
    $origin = trim(
        (string) ($_SERVER['HTTP_ORIGIN'] ?? '')
    );

    if ($origin === '') {
        return;
    }

    $originHost = parse_url($origin, PHP_URL_HOST);
    $requestHost = $_SERVER['HTTP_HOST'] ?? '';

    if (
        !is_string($originHost) ||
        !is_string($requestHost) ||
        $originHost === '' ||
        $requestHost === ''
    ) {
        respond(
            403,
            false,
            'The request origin could not be verified.'
        );
    }

    if (
        normalizeHost($originHost) !==
        normalizeHost($requestHost)
    ) {
        respond(
            403,
            false,
            'The request origin is not allowed.'
        );
    }
}

function checkRateLimit(string $ipAddress): void
{
    if ($ipAddress === '') {
        return;
    }

    $directory =
        rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) .
        DIRECTORY_SEPARATOR .
        'nimomark-contact-rate-limit';

    if (
        !is_dir($directory) &&
        !@mkdir($directory, 0700, true) &&
        !is_dir($directory)
    ) {
        return;
    }

    $filePath =
        $directory .
        DIRECTORY_SEPARATOR .
        hash('sha256', $ipAddress) .
        '.json';

    $handle = @fopen($filePath, 'c+');

    if ($handle === false) {
        return;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return;
        }

        rewind($handle);

        $storedValue = stream_get_contents($handle);
        $timestamps = [];

        if (
            is_string($storedValue) &&
            trim($storedValue) !== ''
        ) {
            $decodedValue = json_decode(
                $storedValue,
                true
            );

            if (is_array($decodedValue)) {
                $timestamps = array_values(
                    array_filter(
                        $decodedValue,
                        static fn($timestamp): bool =>
                        is_int($timestamp) ||
                            ctype_digit((string) $timestamp)
                    )
                );
            }
        }

        $now = time();
        $minimumTimestamp =
            $now - RATE_LIMIT_WINDOW_SECONDS;

        $timestamps = array_values(
            array_filter(
                $timestamps,
                static fn($timestamp): bool =>
                (int) $timestamp >= $minimumTimestamp
            )
        );

        if (
            count($timestamps) >=
            RATE_LIMIT_MAX_REQUESTS
        ) {
            flock($handle, LOCK_UN);

            respond(
                429,
                false,
                'Too many inquiries were submitted. Please wait before trying again.'
            );
        }

        $timestamps[] = $now;

        rewind($handle);
        ftruncate($handle, 0);

        fwrite(
            $handle,
            json_encode($timestamps)
        );

        fflush($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

function extractJsonObject(string $source): ?string
{
    $assignmentPositions = [];

    foreach (
        [
            'window.NIMOMARK_CONFIG',
            'window.NimoMarkConfig',
            'window.nimoMarkConfig',
        ] as $assignmentName
    ) {
        $position = strpos($source, $assignmentName);

        if ($position !== false) {
            $assignmentPositions[] = $position;
        }
    }

    if ($assignmentPositions === []) {
        return null;
    }

    $assignmentPosition = min($assignmentPositions);
    $objectStart = strpos(
        $source,
        '{',
        $assignmentPosition
    );

    if ($objectStart === false) {
        return null;
    }

    $length = strlen($source);
    $depth = 0;
    $inString = false;
    $escaped = false;
    $quoteCharacter = '';

    for (
        $index = $objectStart;
        $index < $length;
        $index++
    ) {
        $character = $source[$index];

        if ($inString) {
            if ($escaped) {
                $escaped = false;
                continue;
            }

            if ($character === '\\') {
                $escaped = true;
                continue;
            }

            if ($character === $quoteCharacter) {
                $inString = false;
                $quoteCharacter = '';
            }

            continue;
        }

        if (
            $character === '"' ||
            $character === "'"
        ) {
            $inString = true;
            $quoteCharacter = $character;
            continue;
        }

        if ($character === '{') {
            $depth++;
            continue;
        }

        if ($character === '}') {
            $depth--;

            if ($depth === 0) {
                return substr(
                    $source,
                    $objectStart,
                    $index - $objectStart + 1
                );
            }
        }
    }

    return null;
}

function loadSiteConfig(): array
{
    $configPath =
        __DIR__ .
        DIRECTORY_SEPARATOR .
        'assets' .
        DIRECTORY_SEPARATOR .
        'js' .
        DIRECTORY_SEPARATOR .
        'config.js';

    if (!is_file($configPath)) {
        return [];
    }

    $source = @file_get_contents($configPath);

    if (!is_string($source) || $source === '') {
        return [];
    }

    $jsonObject = extractJsonObject($source);

    if ($jsonObject === null) {
        return [];
    }

    $decodedConfig = json_decode(
        $jsonObject,
        true
    );

    if (!is_array($decodedConfig)) {
        return [];
    }

    return $decodedConfig;
}

function configValue(
    array $config,
    string $path,
    mixed $fallback = null
): mixed {
    $segments = array_values(
        array_filter(
            array_map(
                'trim',
                explode('.', $path)
            ),
            static fn(string $segment): bool =>
            $segment !== ''
        )
    );

    $currentValue = $config;

    foreach ($segments as $segment) {
        if (
            !is_array($currentValue) ||
            !array_key_exists(
                $segment,
                $currentValue
            )
        ) {
            return $fallback;
        }

        $currentValue = $currentValue[$segment];
    }

    return $currentValue;
}

function firstConfigString(
    array $config,
    array $paths
): string {
    foreach ($paths as $path) {
        $value = configValue(
            $config,
            $path
        );

        if (
            is_string($value) &&
            trim($value) !== ''
        ) {
            return trim($value);
        }
    }

    return '';
}

function emailUsesPlaceholderDomain(
    string $email
): bool {
    $separatorPosition = strrpos(
        $email,
        '@'
    );

    if ($separatorPosition === false) {
        return true;
    }

    $domain = strtolower(
        substr(
            $email,
            $separatorPosition + 1
        )
    );

    return (
        $domain === 'example' ||
        str_ends_with($domain, '.example') ||
        $domain === 'example.com' ||
        str_ends_with($domain, '.example.com')
    );
}

function validOperationalEmail(
    string $email
): bool {
    return (
        $email !== '' &&
        stringLength($email) <= MAX_EMAIL_LENGTH &&
        filter_var(
            $email,
            FILTER_VALIDATE_EMAIL
        ) !== false &&
        !emailUsesPlaceholderDomain($email) &&
        !preg_match('/[\r\n]/', $email)
    );
}

function getRecipientEmail(
    array $config
): string {
    $email = firstConfigString(
        $config,
        [
            'form.recipientEmail',
            'form.recipient',
            'contact.recipientEmail',
            'contact.email',
            'company.email',
        ]
    );

    if (!validOperationalEmail($email)) {
        respond(
            503,
            false,
            'The contact form recipient has not been configured. Replace the placeholder email in assets/js/config.js with a real business email address.'
        );
    }

    return $email;
}

function getSenderEmail(
    array $config,
    string $recipientEmail
): string {
    $configuredSender = firstConfigString(
        $config,
        [
            'form.fromEmail',
            'contact.fromEmail',
            'company.fromEmail',
        ]
    );

    if (
        validOperationalEmail(
            $configuredSender
        )
    ) {
        return $configuredSender;
    }

    return $recipientEmail;
}

function getBrandName(array $config): string
{
    $brandName = firstConfigString(
        $config,
        [
            'brand.name',
            'company.displayName',
            'company.legalName',
        ]
    );

    return $brandName !== ''
        ? singleLine($brandName)
        : 'NimoMark';
}

function getAllowedInquiryTypes(
    array $config
): array {
    $allowed = [
        'career-support' => 'Career support inquiry',
        'advertise-collaborate' => 'Advertise and collaborate',
        'general-question' => 'General platform question',
    ];

    $candidates = [
        configValue(
            $config,
            'pages.contact.inquiryTypes',
            []
        ),
        configValue(
            $config,
            'contact.inquiryTypes',
            []
        ),
        configValue(
            $config,
            'form.inquiryTypes',
            []
        ),
    ];

    foreach ($candidates as $entries) {
        if (!is_array($entries)) {
            continue;
        }

        foreach ($entries as $entry) {
            if (!is_array($entry)) {
                continue;
            }

            $value = trim(
                (string) (
                    $entry['value'] ??
                    $entry['slug'] ??
                    $entry['id'] ??
                    ''
                )
            );

            $label = trim(
                (string) (
                    $entry['title'] ??
                    $entry['label'] ??
                    $entry['name'] ??
                    $value
                )
            );

            if (
                $value !== '' &&
                preg_match(
                    '/^[a-z0-9][a-z0-9-]{0,79}$/',
                    $value
                )
            ) {
                $allowed[$value] =
                    $label !== ''
                    ? $label
                    : $value;
            }
        }
    }

    return $allowed;
}

function getAllowedServices(
    array $config
): array {
    $allowed = [
        'not-sure' => 'I am not sure yet',
        'resume-writing' => 'Resume Writing',
        'linkedin-profile-optimization' =>
        'LinkedIn Profile Optimization',
        'cover-letter-writing' =>
        'Cover Letter Writing',
        'it-resume-services' =>
        'IT Resume Services',
        'resume-for-newcomers' =>
        'Resume for Newcomers',
        'executive-resume-services' =>
        'Executive Resume Services',
        'interview-preparation' =>
        'Interview Preparation',
        'international-job-positioning' =>
        'International Job Positioning',
    ];

    $services = configValue(
        $config,
        'services',
        []
    );

    if (!is_array($services)) {
        return $allowed;
    }

    foreach ($services as $service) {
        if (!is_array($service)) {
            continue;
        }

        $slug = trim(
            (string) (
                $service['slug'] ??
                $service['id'] ??
                ''
            )
        );

        $title = trim(
            (string) (
                $service['title'] ??
                $service['name'] ??
                $service['label'] ??
                $slug
            )
        );

        if (
            $slug !== '' &&
            preg_match(
                '/^[a-z0-9][a-z0-9-]{0,99}$/',
                $slug
            )
        ) {
            $allowed[$slug] =
                $title !== ''
                ? $title
                : $slug;
        }
    }

    return $allowed;
}

function validateSourcePage(
    string $sourcePage
): string {
    $sourcePage = singleLine(
        $sourcePage
    );

    if (
        stringLength($sourcePage) >
        MAX_SOURCE_PAGE_LENGTH
    ) {
        return '';
    }

    if ($sourcePage === '') {
        return '';
    }

    if (
        str_starts_with($sourcePage, '/') ||
        preg_match(
            '/^[a-zA-Z0-9._\/?#=&%-]+$/',
            $sourcePage
        )
    ) {
        return $sourcePage;
    }

    return '';
}

function encodeMimeHeader(string $value): string
{
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader(
            $value,
            'UTF-8',
            'B',
            "\r\n"
        );
    }

    return '=?UTF-8?B?' .
        base64_encode($value) .
        '?=';
}

function formatMailBody(
    array $values
): string {
    $lines = [
        'New NimoMark website inquiry',
        '',
        'Request ID: ' . $values['requestId'],
        'Received: ' . $values['receivedAt'],
        '',
        'Full name: ' . $values['fullName'],
        'Email: ' . $values['email'],
        'Current country: ' .
            (
                $values['currentCountry'] !== ''
                ? $values['currentCountry']
                : 'Not provided'
            ),
        'Inquiry type: ' . $values['inquiryTypeLabel'],
        'Service: ' .
            (
                $values['serviceLabel'] !== ''
                ? $values['serviceLabel']
                : 'Not selected'
            ),
        'Source page: ' .
            (
                $values['sourcePage'] !== ''
                ? $values['sourcePage']
                : 'Not provided'
            ),
        'Page title: ' .
            (
                $values['pageTitle'] !== ''
                ? $values['pageTitle']
                : 'Not provided'
            ),
        'Client timestamp: ' .
            (
                $values['submittedAt'] !== ''
                ? $values['submittedAt']
                : 'Not provided'
            ),
        'Privacy consent: Confirmed',
        '',
        'Message:',
        '------------------------------------------------------------',
        $values['message'],
        '------------------------------------------------------------',
        '',
        'This message was submitted through the NimoMark contact form.',
        'Reply directly to the sender using the Reply-To address.',
    ];

    return implode("\r\n", $lines);
}

validateRequestMethod();
validateRequestSize();
validateContentType();
validateSameOrigin();

$requestId = requestIdentifier();
$ipAddress = requestIpAddress();

checkRateLimit($ipAddress);

if (!isset($_POST) || !is_array($_POST)) {
    respond(
        400,
        false,
        'No form data was received.',
        [
            'requestId' => $requestId,
        ]
    );
}

$honeypot = textField(
    $_POST,
    'company'
);

if ($honeypot !== '') {
    respond(
        200,
        true,
        'Thank you. Your inquiry has been submitted for review.',
        [
            'requestId' => $requestId,
        ]
    );
}

$fullName = singleLine(
    textField(
        $_POST,
        'fullName'
    )
);

$email = strtolower(
    singleLine(
        textField(
            $_POST,
            'email'
        )
    )
);

$currentCountry = singleLine(
    textField(
        $_POST,
        'currentCountry'
    )
);

$inquiryType = strtolower(
    singleLine(
        textField(
            $_POST,
            'inquiryType'
        )
    )
);

$service = strtolower(
    singleLine(
        textField(
            $_POST,
            'service'
        )
    )
);

$message = normalizeMessage(
    textField(
        $_POST,
        'message'
    )
);

$privacyConsent = strtolower(
    singleLine(
        textField(
            $_POST,
            'privacyConsent'
        )
    )
);

$sourcePage = validateSourcePage(
    textField(
        $_POST,
        'sourcePage'
    )
);

$pageTitle = singleLine(
    textField(
        $_POST,
        'pageTitle'
    )
);

$submittedAt = singleLine(
    textField(
        $_POST,
        'submittedAt'
    )
);

if (
    stringLength($fullName) < 2 ||
    stringLength($fullName) > MAX_NAME_LENGTH
) {
    respond(
        422,
        false,
        'Enter a valid full name containing between 2 and 120 characters.',
        [
            'field' => 'fullName',
            'requestId' => $requestId,
        ]
    );
}

if (
    stringLength($email) > MAX_EMAIL_LENGTH ||
    filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    ) === false ||
    preg_match('/[\r\n]/', $email)
) {
    respond(
        422,
        false,
        'Enter a valid email address.',
        [
            'field' => 'email',
            'requestId' => $requestId,
        ]
    );
}

if (
    stringLength($currentCountry) >
    MAX_COUNTRY_LENGTH
) {
    respond(
        422,
        false,
        'The country value is too long.',
        [
            'field' => 'currentCountry',
            'requestId' => $requestId,
        ]
    );
}

if (
    stringLength($pageTitle) >
    MAX_PAGE_TITLE_LENGTH
) {
    $pageTitle = substr(
        $pageTitle,
        0,
        MAX_PAGE_TITLE_LENGTH
    );
}

if (
    stringLength($submittedAt) > 80
) {
    $submittedAt = '';
}

$config = loadSiteConfig();

$allowedInquiryTypes =
    getAllowedInquiryTypes($config);

if (
    $inquiryType === '' ||
    !array_key_exists(
        $inquiryType,
        $allowedInquiryTypes
    )
) {
    respond(
        422,
        false,
        'Choose a valid inquiry type.',
        [
            'field' => 'inquiryType',
            'requestId' => $requestId,
        ]
    );
}

$allowedServices =
    getAllowedServices($config);

if (
    $service !== '' &&
    !array_key_exists(
        $service,
        $allowedServices
    )
) {
    respond(
        422,
        false,
        'Choose a valid service or leave the service field undecided.',
        [
            'field' => 'service',
            'requestId' => $requestId,
        ]
    );
}

$messageLength = stringLength($message);

if (
    $messageLength < MIN_MESSAGE_LENGTH ||
    $messageLength > MAX_MESSAGE_LENGTH
) {
    respond(
        422,
        false,
        'Your message must contain between 20 and 4,000 characters.',
        [
            'field' => 'message',
            'requestId' => $requestId,
        ]
    );
}

if (
    !in_array(
        $privacyConsent,
        [
            'accepted',
            'on',
            'yes',
            'true',
            '1',
        ],
        true
    )
) {
    respond(
        422,
        false,
        'Confirm that you have read the Privacy Policy.',
        [
            'field' => 'privacyConsent',
            'requestId' => $requestId,
        ]
    );
}

$recipientEmail =
    getRecipientEmail($config);

$senderEmail = getSenderEmail(
    $config,
    $recipientEmail
);

$brandName = getBrandName($config);

$inquiryTypeLabel =
    $allowedInquiryTypes[$inquiryType];

$serviceLabel =
    $service !== ''
    ? ($allowedServices[$service] ?? $service)
    : '';

$subjectParts = [
    $brandName . ' inquiry',
    $inquiryTypeLabel,
];

if (
    $serviceLabel !== '' &&
    $service !== 'not-sure'
) {
    $subjectParts[] = $serviceLabel;
}

$subject = singleLine(
    implode(' — ', $subjectParts)
);

$mailBody = formatMailBody(
    [
        'requestId' => $requestId,
        'receivedAt' => gmdate(
            'Y-m-d H:i:s'
        ) . ' UTC',
        'fullName' => $fullName,
        'email' => $email,
        'currentCountry' => $currentCountry,
        'inquiryTypeLabel' =>
        $inquiryTypeLabel,
        'serviceLabel' => $serviceLabel,
        'sourcePage' => $sourcePage,
        'pageTitle' => $pageTitle,
        'submittedAt' => $submittedAt,
        'message' => $message,
    ]
);

$encodedBrandName =
    encodeMimeHeader($brandName);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: ' .
        $encodedBrandName .
        ' Website <' .
        $senderEmail .
        '>',
    'Reply-To: ' .
        encodeMimeHeader($fullName) .
        ' <' .
        $email .
        '>',
    'X-Mailer: PHP/' . PHP_VERSION,
    'X-Contact-Request-ID: ' . $requestId,
];

$mailSent = @mail(
    $recipientEmail,
    encodeMimeHeader($subject),
    $mailBody,
    implode("\r\n", $headers)
);

if (!$mailSent) {
    error_log(
        sprintf(
            'NimoMark contact form mail failure. Request ID: %s',
            $requestId
        )
    );

    respond(
        500,
        false,
        'Your inquiry could not be sent because email delivery is not configured on this server. Please contact us directly by email.',
        [
            'requestId' => $requestId,
        ]
    );
}

respond(
    200,
    true,
    'Thank you. Your inquiry has been submitted for review.',
    [
        'requestId' => $requestId,
    ]
);
