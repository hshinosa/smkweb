#!/bin/bash

################################################################################
# Cookie Security Verification Script
# 
# This script performs comprehensive testing of cookie security attributes
# for the SMAN 1 Baleendah web application.
#
# Usage: ./verify-cookie-security.sh [URL]
# Example: ./verify-cookie-security.sh https://sman1-baleendah.com
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default URL
URL="${1:-http://127.0.0.1:8000}"
PASSED=0
FAILED=0
WARNINGS=0

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Cookie Security Verification Tool v1.0                ║"
echo "║         SMAN 1 Baleendah - Security Testing                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Testing URL: ${URL}${NC}"
echo ""

# Function to print test result
print_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"
    
    if [ "$result" == "PASS" ]; then
        echo -e "  ${GREEN}✓${NC} ${test_name}: ${GREEN}PASSED${NC}"
        ((PASSED++))
    elif [ "$result" == "FAIL" ]; then
        echo -e "  ${RED}✗${NC} ${test_name}: ${RED}FAILED${NC}"
        if [ -n "$message" ]; then
            echo -e "    ${RED}→ ${message}${NC}"
        fi
        ((FAILED++))
    elif [ "$result" == "WARN" ]; then
        echo -e "  ${YELLOW}⚠${NC} ${test_name}: ${YELLOW}WARNING${NC}"
        if [ -n "$message" ]; then
            echo -e "    ${YELLOW}→ ${message}${NC}"
        fi
        ((WARNINGS++))
    fi
}

# Test 1: Check if site is accessible
echo -e "${BLUE}[1/10] Checking site accessibility...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "^[23]"; then
    print_result "Site Accessibility" "PASS"
else
    print_result "Site Accessibility" "FAIL" "Cannot connect to $URL"
    exit 1
fi

# Get cookies from the response
echo -e "\n${BLUE}[2/10] Fetching cookies...${NC}"
COOKIES=$(curl -sI "$URL" | grep -i "set-cookie" || echo "")

if [ -z "$COOKIES" ]; then
    print_result "Cookie Detection" "WARN" "No cookies found in response"
else
    print_result "Cookie Detection" "PASS" "$(echo "$COOKIES" | wc -l) cookies found"
fi

# Test 2: Check HttpOnly flag
echo -e "\n${BLUE}[3/10] Checking HttpOnly flag...${NC}"
if echo "$COOKIES" | grep -i "httponly" > /dev/null; then
    print_result "HttpOnly Flag" "PASS" "HttpOnly attribute present"
else
    print_result "HttpOnly Flag" "FAIL" "Missing HttpOnly attribute on cookies"
fi

# Test 3: Check Secure flag
echo -e "\n${BLUE}[4/10] Checking Secure flag...${NC}"
if [[ "$URL" == https://* ]]; then
    if echo "$COOKIES" | grep -i "secure" > /dev/null; then
        print_result "Secure Flag (HTTPS)" "PASS" "Secure attribute present"
    else
        print_result "Secure Flag (HTTPS)" "FAIL" "Missing Secure attribute on HTTPS site"
    fi
else
    print_result "Secure Flag (HTTP)" "WARN" "Testing on HTTP - Secure flag should be enabled for HTTPS"
fi

# Test 4: Check SameSite attribute
echo -e "\n${BLUE}[5/10] Checking SameSite attribute...${NC}"
if echo "$COOKIES" | grep -iE "samesite=(lax|strict|none)" > /dev/null; then
    SAMESITE_VALUE=$(echo "$COOKIES" | grep -ioE "samesite=(lax|strict|none)" | head -1 | cut -d'=' -f2)
    print_result "SameSite Attribute" "PASS" "SameSite=$SAMESITE_VALUE detected"
else
    print_result "SameSite Attribute" "FAIL" "Missing SameSite attribute"
fi

# Test 5: Check XSRF-TOKEN is not HttpOnly
echo -e "\n${BLUE}[6/10] Checking XSRF-TOKEN configuration...${NC}"
XSRF_COOKIE=$(echo "$COOKIES" | grep -i "xsrf-token" || echo "")
if [ -n "$XSRF_COOKIE" ]; then
    if echo "$XSRF_COOKIE" | grep -i "httponly" > /dev/null; then
        print_result "XSRF-TOKEN HttpOnly" "FAIL" "XSRF-TOKEN should NOT be HttpOnly (needs JavaScript access)"
    else
        print_result "XSRF-TOKEN HttpOnly" "PASS" "XSRF-TOKEN correctly allows JavaScript access"
    fi
else
    print_result "XSRF-TOKEN Detection" "WARN" "XSRF-TOKEN cookie not found"
fi

# Test 6: Check for __Secure- prefix validation
echo -e "\n${BLUE}[7/10] Checking __Secure- prefix cookies...${NC}"
SECURE_PREFIX_COOKIES=$(echo "$COOKIES" | grep -i "__secure-" || echo "")
if [ -n "$SECURE_PREFIX_COOKIES" ]; then
    if echo "$SECURE_PREFIX_COOKIES" | grep -i "secure" > /dev/null; then
        print_result "__Secure- Prefix" "PASS" "__Secure- cookies have Secure flag"
    else
        print_result "__Secure- Prefix" "FAIL" "__Secure- cookies missing Secure flag (RFC violation)"
    fi
else
    print_result "__Secure- Prefix" "PASS" "No __Secure- prefixed cookies (optional)"
fi

# Test 7: Check for __Host- prefix validation
echo -e "\n${BLUE}[8/10] Checking __Host- prefix cookies...${NC}"
HOST_PREFIX_COOKIES=$(echo "$COOKIES" | grep -i "__host-" || echo "")
if [ -n "$HOST_PREFIX_COOKIES" ]; then
    VIOLATIONS=0
    
    if ! echo "$HOST_PREFIX_COOKIES" | grep -i "secure" > /dev/null; then
        ((VIOLATIONS++))
    fi
    
    if echo "$HOST_PREFIX_COOKIES" | grep -i "domain=" > /dev/null; then
        ((VIOLATIONS++))
    fi
    
    if ! echo "$HOST_PREFIX_COOKIES" | grep -i "path=/" > /dev/null; then
        ((VIOLATIONS++))
    fi
    
    if [ $VIOLATIONS -eq 0 ]; then
        print_result "__Host- Prefix" "PASS" "__Host- cookies meet all RFC requirements"
    else
        print_result "__Host- Prefix" "FAIL" "__Host- cookies have $VIOLATIONS RFC violations"
    fi
else
    print_result "__Host- Prefix" "PASS" "No __Host- prefixed cookies (optional)"
fi

# Test 8: Check Security Headers
echo -e "\n${BLUE}[9/10] Checking Security Headers...${NC}"
HEADERS=$(curl -sI "$URL")

# Check for HSTS
if echo "$HEADERS" | grep -i "strict-transport-security" > /dev/null; then
    print_result "HSTS Header" "PASS" "Strict-Transport-Security header present"
else
    if [[ "$URL" == https://* ]]; then
        print_result "HSTS Header" "WARN" "Consider adding HSTS header for HTTPS sites"
    else
        print_result "HSTS Header" "PASS" "HSTS not applicable for HTTP"
    fi
fi

# Check for X-Frame-Options
if echo "$HEADERS" | grep -i "x-frame-options" > /dev/null; then
    print_result "X-Frame-Options" "PASS" "Clickjacking protection enabled"
else
    print_result "X-Frame-Options" "WARN" "Consider adding X-Frame-Options header"
fi

# Test 9: Check Cookie Expiration
echo -e "\n${BLUE}[10/10] Checking Cookie Expiration...${NC}"
if echo "$COOKIES" | grep -iE "(expires|max-age)" > /dev/null; then
    print_result "Cookie Expiration" "PASS" "Cookies have expiration set"
else
    print_result "Cookie Expiration" "WARN" "Cookies may be session-only (expires on browser close)"
fi

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                      Test Summary                              ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo -e "║  ${GREEN}Passed:${NC}   ${PASSED} tests                                          ║"
echo -e "║  ${RED}Failed:${NC}   ${FAILED} tests                                          ║"
echo -e "║  ${YELLOW}Warnings:${NC} ${WARNINGS} tests                                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Detailed cookie information
if [ -n "$COOKIES" ]; then
    echo ""
    echo -e "${BLUE}Detailed Cookie Information:${NC}"
    echo "$COOKIES" | while IFS= read -r line; do
        echo "  $line"
    done
fi

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    echo ""
    echo -e "${RED}✗ Security issues detected. Please review and fix failures.${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠ Some warnings detected. Review recommended improvements.${NC}"
    exit 0
else
    echo ""
    echo -e "${GREEN}✓ All security checks passed!${NC}"
    exit 0
fi
