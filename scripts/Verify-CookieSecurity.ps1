# PowerShell Cookie Security Verification Script
# For Windows environments
# Usage: .\Verify-CookieSecurity.ps1 -Url "http://127.0.0.1:8000"

param(
    [Parameter(Mandatory=$false)]
    [string]$Url = "http://127.0.0.1:8000",
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose,
    
    [Parameter(Mandatory=$false)]
    [switch]$ExportReport
)

# Colors
$ColorPass = "Green"
$ColorFail = "Red"
$ColorWarn = "Yellow"
$ColorInfo = "Cyan"

$Script:Passed = 0
$Script:Failed = 0
$Script:Warnings = 0
$Script:TestResults = @()

function Write-Header {
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor $ColorInfo
    Write-Host "║         Cookie Security Verification Tool v1.0                ║" -ForegroundColor $ColorInfo
    Write-Host "║         SMAN 1 Baleendah - Security Testing                   ║" -ForegroundColor $ColorInfo
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor $ColorInfo
    Write-Host ""
    Write-Host "Testing URL: $Url" -ForegroundColor $ColorInfo
    Write-Host ""
}

function Write-TestResult {
    param(
        [string]$TestName,
        [string]$Result,
        [string]$Message = ""
    )
    
    $resultObj = [PSCustomObject]@{
        Test = $TestName
        Result = $Result
        Message = $Message
        Timestamp = Get-Date
    }
    
    $Script:TestResults += $resultObj
    
    switch ($Result) {
        "PASS" {
            Write-Host "  ✓ $TestName`: " -NoNewline -ForegroundColor $ColorPass
            Write-Host "PASSED" -ForegroundColor $ColorPass
            $Script:Passed++
        }
        "FAIL" {
            Write-Host "  ✗ $TestName`: " -NoNewline -ForegroundColor $ColorFail
            Write-Host "FAILED" -ForegroundColor $ColorFail
            if ($Message) {
                Write-Host "    → $Message" -ForegroundColor $ColorFail
            }
            $Script:Failed++
        }
        "WARN" {
            Write-Host "  ⚠ $TestName`: " -NoNewline -ForegroundColor $ColorWarn
            Write-Host "WARNING" -ForegroundColor $ColorWarn
            if ($Message) {
                Write-Host "    → $Message" -ForegroundColor $ColorWarn
            }
            $Script:Warnings++
        }
    }
}

function Get-CookieAttributes {
    param([string]$CookieString)
    
    $attributes = @{
        HasSecure = $false
        HasHttpOnly = $false
        SameSite = $null
        Expires = $null
        MaxAge = $null
        Domain = $null
        Path = $null
    }
    
    if ($CookieString -match 'Secure') {
        $attributes.HasSecure = $true
    }
    
    if ($CookieString -match 'HttpOnly') {
        $attributes.HasHttpOnly = $true
    }
    
    if ($CookieString -match 'SameSite=([^;]+)') {
        $attributes.SameSite = $Matches[1].Trim()
    }
    
    if ($CookieString -match 'expires=([^;]+)') {
        $attributes.Expires = $Matches[1].Trim()
    }
    
    if ($CookieString -match 'Max-Age=(\d+)') {
        $attributes.MaxAge = [int]$Matches[1]
    }
    
    if ($CookieString -match 'Domain=([^;]+)') {
        $attributes.Domain = $Matches[1].Trim()
    }
    
    if ($CookieString -match 'Path=([^;]+)') {
        $attributes.Path = $Matches[1].Trim()
    }
    
    return $attributes
}

# Main execution
try {
    Write-Header
    
    # Test 1: Site Accessibility
    Write-Host "[1/10] Checking site accessibility..." -ForegroundColor $ColorInfo
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -SessionVariable session -UseBasicParsing -ErrorAction Stop
        Write-TestResult "Site Accessibility" "PASS"
    }
    catch {
        Write-TestResult "Site Accessibility" "FAIL" "Cannot connect to $Url - $($_.Exception.Message)"
        exit 1
    }
    
    # Test 2: Cookie Detection
    Write-Host ""
    Write-Host "[2/10] Fetching cookies..." -ForegroundColor $ColorInfo
    $cookies = $session.Cookies.GetCookies($Url)
    
    if ($cookies.Count -eq 0) {
        Write-TestResult "Cookie Detection" "WARN" "No cookies found in response"
    }
    else {
        Write-TestResult "Cookie Detection" "PASS" "$($cookies.Count) cookies found"
    }
    
    # Get Set-Cookie headers
    $setCookieHeaders = $response.Headers['Set-Cookie']
    
    # Test 3: HttpOnly Flag
    Write-Host ""
    Write-Host "[3/10] Checking HttpOnly flag..." -ForegroundColor $ColorInfo
    $hasHttpOnly = $false
    foreach ($header in $setCookieHeaders) {
        if ($header -match 'HttpOnly') {
            $hasHttpOnly = $true
            break
        }
    }
    
    if ($hasHttpOnly) {
        Write-TestResult "HttpOnly Flag" "PASS" "HttpOnly attribute present"
    }
    else {
        Write-TestResult "HttpOnly Flag" "FAIL" "Missing HttpOnly attribute on cookies"
    }
    
    # Test 4: Secure Flag
    Write-Host ""
    Write-Host "[4/10] Checking Secure flag..." -ForegroundColor $ColorInfo
    $isHttps = $Url -match '^https://'
    $hasSecure = $false
    
    foreach ($header in $setCookieHeaders) {
        if ($header -match 'Secure') {
            $hasSecure = $true
            break
        }
    }
    
    if ($isHttps) {
        if ($hasSecure) {
            Write-TestResult "Secure Flag (HTTPS)" "PASS" "Secure attribute present"
        }
        else {
            Write-TestResult "Secure Flag (HTTPS)" "FAIL" "Missing Secure attribute on HTTPS site"
        }
    }
    else {
        Write-TestResult "Secure Flag (HTTP)" "WARN" "Testing on HTTP - Secure flag should be enabled for HTTPS"
    }
    
    # Test 5: SameSite Attribute
    Write-Host ""
    Write-Host "[5/10] Checking SameSite attribute..." -ForegroundColor $ColorInfo
    $hasSameSite = $false
    $sameSiteValue = $null
    
    foreach ($header in $setCookieHeaders) {
        if ($header -match 'SameSite=([^;]+)') {
            $hasSameSite = $true
            $sameSiteValue = $Matches[1].Trim()
            break
        }
    }
    
    if ($hasSameSite) {
        Write-TestResult "SameSite Attribute" "PASS" "SameSite=$sameSiteValue detected"
    }
    else {
        Write-TestResult "SameSite Attribute" "FAIL" "Missing SameSite attribute"
    }
    
    # Test 6: XSRF-TOKEN Configuration
    Write-Host ""
    Write-Host "[6/10] Checking XSRF-TOKEN configuration..." -ForegroundColor $ColorInfo
    $xsrfCookie = $setCookieHeaders | Where-Object { $_ -match 'XSRF-TOKEN' }
    
    if ($xsrfCookie) {
        if ($xsrfCookie -match 'HttpOnly') {
            Write-TestResult "XSRF-TOKEN HttpOnly" "FAIL" "XSRF-TOKEN should NOT be HttpOnly (needs JavaScript access)"
        }
        else {
            Write-TestResult "XSRF-TOKEN HttpOnly" "PASS" "XSRF-TOKEN correctly allows JavaScript access"
        }
    }
    else {
        Write-TestResult "XSRF-TOKEN Detection" "WARN" "XSRF-TOKEN cookie not found"
    }
    
    # Test 7: __Secure- Prefix
    Write-Host ""
    Write-Host "[7/10] Checking __Secure- prefix cookies..." -ForegroundColor $ColorInfo
    $securePrefixCookies = $setCookieHeaders | Where-Object { $_ -match '__Secure-' }
    
    if ($securePrefixCookies) {
        $allValid = $true
        foreach ($cookie in $securePrefixCookies) {
            if ($cookie -notmatch 'Secure') {
                $allValid = $false
                break
            }
        }
        
        if ($allValid) {
            Write-TestResult "__Secure- Prefix" "PASS" "__Secure- cookies have Secure flag"
        }
        else {
            Write-TestResult "__Secure- Prefix" "FAIL" "__Secure- cookies missing Secure flag (RFC violation)"
        }
    }
    else {
        Write-TestResult "__Secure- Prefix" "PASS" "No __Secure- prefixed cookies (optional)"
    }
    
    # Test 8: __Host- Prefix
    Write-Host ""
    Write-Host "[8/10] Checking __Host- prefix cookies..." -ForegroundColor $ColorInfo
    $hostPrefixCookies = $setCookieHeaders | Where-Object { $_ -match '__Host-' }
    
    if ($hostPrefixCookies) {
        $violations = 0
        
        foreach ($cookie in $hostPrefixCookies) {
            if ($cookie -notmatch 'Secure') { $violations++ }
            if ($cookie -match 'Domain=') { $violations++ }
            if ($cookie -notmatch 'Path=/(?![^;])') { $violations++ }
        }
        
        if ($violations -eq 0) {
            Write-TestResult "__Host- Prefix" "PASS" "__Host- cookies meet all RFC requirements"
        }
        else {
            Write-TestResult "__Host- Prefix" "FAIL" "__Host- cookies have $violations RFC violations"
        }
    }
    else {
        Write-TestResult "__Host- Prefix" "PASS" "No __Host- prefixed cookies (optional)"
    }
    
    # Test 9: Security Headers
    Write-Host ""
    Write-Host "[9/10] Checking Security Headers..." -ForegroundColor $ColorInfo
    
    # Check HSTS
    if ($response.Headers['Strict-Transport-Security']) {
        Write-TestResult "HSTS Header" "PASS" "Strict-Transport-Security header present"
    }
    else {
        if ($isHttps) {
            Write-TestResult "HSTS Header" "WARN" "Consider adding HSTS header for HTTPS sites"
        }
        else {
            Write-TestResult "HSTS Header" "PASS" "HSTS not applicable for HTTP"
        }
    }
    
    # Check X-Frame-Options
    if ($response.Headers['X-Frame-Options']) {
        Write-TestResult "X-Frame-Options" "PASS" "Clickjacking protection enabled"
    }
    else {
        Write-TestResult "X-Frame-Options" "WARN" "Consider adding X-Frame-Options header"
    }
    
    # Test 10: Cookie Expiration
    Write-Host ""
    Write-Host "[10/10] Checking Cookie Expiration..." -ForegroundColor $ColorInfo
    $hasExpiration = $false
    
    foreach ($header in $setCookieHeaders) {
        if ($header -match '(expires=|Max-Age=)') {
            $hasExpiration = $true
            break
        }
    }
    
    if ($hasExpiration) {
        Write-TestResult "Cookie Expiration" "PASS" "Cookies have expiration set"
    }
    else {
        Write-TestResult "Cookie Expiration" "WARN" "Cookies may be session-only (expires on browser close)"
    }
    
    # Summary
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor $ColorInfo
    Write-Host "║                      Test Summary                              ║" -ForegroundColor $ColorInfo
    Write-Host "╠════════════════════════════════════════════════════════════════╣" -ForegroundColor $ColorInfo
    Write-Host "║  Passed:   $Script:Passed tests" -ForegroundColor $ColorPass
    Write-Host "║  Failed:   $Script:Failed tests" -ForegroundColor $ColorFail
    Write-Host "║  Warnings: $Script:Warnings tests" -ForegroundColor $ColorWarn
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor $ColorInfo
    
    # Detailed cookie information
    if ($Verbose -and $setCookieHeaders) {
        Write-Host ""
        Write-Host "Detailed Cookie Information:" -ForegroundColor $ColorInfo
        foreach ($header in $setCookieHeaders) {
            Write-Host "  $header" -ForegroundColor Gray
        }
    }
    
    # Export report if requested
    if ($ExportReport) {
        $reportPath = ".\cookie-security-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
        $reportData = @{
            Url = $Url
            Timestamp = Get-Date
            Summary = @{
                Passed = $Script:Passed
                Failed = $Script:Failed
                Warnings = $Script:Warnings
            }
            Tests = $Script:TestResults
            Cookies = $setCookieHeaders
        }
        
        $reportData | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath
        Write-Host ""
        Write-Host "Report exported to: $reportPath" -ForegroundColor $ColorInfo
    }
    
    # Exit with appropriate code
    Write-Host ""
    if ($Script:Failed -gt 0) {
        Write-Host "✗ Security issues detected. Please review and fix failures." -ForegroundColor $ColorFail
        exit 1
    }
    elseif ($Script:Warnings -gt 0) {
        Write-Host "⚠ Some warnings detected. Review recommended improvements." -ForegroundColor $ColorWarn
        exit 0
    }
    else {
        Write-Host "✓ All security checks passed!" -ForegroundColor $ColorPass
        exit 0
    }
}
catch {
    Write-Host ""
    Write-Host "Error during testing: $($_.Exception.Message)" -ForegroundColor $ColorFail
    Write-Host $_.ScriptStackTrace -ForegroundColor $ColorFail
    exit 1
}
