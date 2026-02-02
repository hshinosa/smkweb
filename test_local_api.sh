@echo off
setlocal enabledelayedexpansion

echo ================================================================
  Simple API Test Script - SSE Streaming & Caching
===============================================================

echo Server: http://127.0.0.1:8000
Redis: localhost:32770 (mapped)
PostgreSQL: localhost:5432
Ollama: localhost:11434

===============================================================
  Test 1: Health Check
===============================================================
echo -nTest: Health endpoint\n

curl -w \n"Health Status: " http_code=$?"\n\n"

echo ================================================================
  Test 2: Simple Chat Test (No Streaming)
===============================================================
echo -nTest 1: Simple message without RAG\n"

curl -s "http://127.0.0.1:8000/api/chat/send" \
-H "Content-Type: application/json" \
-H "X-CSRF-TOKEN: "test-token" \
-d '{
  "message": "Halo, ini adalah tes pertama pesan dari local!",
  "stream": false,
  "use_cache": false
}' \
-w "HTTP: http_code=%{status_code}\n%-15s  Response time: %{elapsed}ms\n%-10s  JSON:\n' \n"
echo ================================================================
  Test 3: Chat WITH RAG
===============================================================
echo -nTest: RAG message\n"

curl -s "http://127.0.0.1:8000/api/chat/send" \
-H "Content-Type: application/json" \
-H "X-CSRF-TOKEN: test-token" \
-d '{
  "message": "Apa beda biaya masuk ke SMAN 1 Baleendah?",
  "stream": false,
  "use_cache": false,
  "use_rag": true
}' \
-w "HTTP: http_code=%{status_code}\n%-15s  Response time: %{elapsed}ms\n%-10s  JSON:\n' \n"

echo ================================================================
  Test 4: Chat WITH Cache (First Request - Cache Miss)
===============================================================
echo -nTest: Cache miss (first time query)\n"

curl -s "http://127.0.0.1:8000/api/chat/send" \
-H "Content-Type: application/json" \
-H "X-CSRF-TOKEN: test-token" \
-d '{
  "message": "Berapa alamat SMA Negeri 1 Baleendah?",
  "stream": false,
  "use_cache": true
}' \
-w "HTTP: http_code=%{status_code}\n%-15s  Response time: %{elapsed}ms\n%-10s  Provider: %{provider}\n%-10s  Cached: %{cached}\n' \n"

echo ================================================================
  Test 5: Chat WITH Cache (Second Request - Cache Hit)
===============================================================
echo -nTest: Cache hit (repeat same query)\n"

curl -s "http://127.0.0.1:8000/api/chat/send" \
-H "Content-Type: application/json" \
-H "X-CSRF-TOKEN: test-token" \
-d '{
  "message": "Berapa alamat SMA Negeri 1 Baleendah?",
  "stream": false,
  "use_cache": true
}' \
-w "HTTP: http_code=%{status_code}\n%-15s  Response time: %{elapsed}ms\n%-10s  Provider: %{provider}\n%-10s  Cached: %{cached}\n' \n"

echo ================================================================
  Test 6: SSE Streaming (Manual Check)
===============================================================
echo -nTest: Message with streaming enabled\n"

curl -s "http://127.0.0.1:8000/api/chat/send" \
-H "Content-Type: application/json" \
-H "X-CSRF-TOKEN: test-token" \
-H "Accept: text/event-stream" \
-d '{
  "message": "Streaming test - tolong ini adalah teks untuk melihat efeknya",
  "stream": true,
  "use_cache": false,
  "use_rag": true
}' \
-w "=== Streaming Output ===\n"

echo ""
echo "Expected behavior:"
echo "- First streaming chunk should arrive in < 1s"
echo "- Multiple chunks will be displayed incrementally"
echo "- 'done' event indicates completion"
echo ""

echo ================================================================
  Test 7: Check Cache Stats
===============================================================
echo -nGet cache statistics\n"

curl -s "http://127.0.0.1:8000/api/chat/stats" -H "Content-Type: application/json" \
-w "Cache Stats:\n  - Size: %{size}\n  - Hit count: %{hits}\n  - Miss count: %{misses}\n  - Hit rate: %{rate:.1f}%%\n\n" \n"

echo ================================================================
  Test 8: Get Chat History
===============================================================
echo -nGet empty history\n"

curl -s "http://127.0.0.1:8000/api/chat/history?session_id=test-session-123&limit=5" \
-H "Content-Type: application/json" \
-w "History:\n  Empty history: %{empty}\n\n" \n"

echo ================================================================
  SUMMARY
===============================================================
echo ""
echo "✓ Tests completed!"
echo "✓ Check server logs for any errors:"
echo "   docker logs sman1-baleendah-nginx --tail 20"
echo "   docker logs sman1-baleendah-app --tail 20"
echo ""
echo "✓ Check documentation created in docs/CACHE_TEST_RESULTS.md"
echo "✓ Streaming already implemented in frontend (ChatWidget.jsx)"
echo "✓ Service layer already has caching support (ChatCacheService.php)"
echo "✓ Controller has cache endpoints (/api/chat/stats, api/chat/cache/clear)"
echo ""
echo "To test streaming manually:"
echo "  curl -s -H 'Accept: text/event-stream' \\"
echo "     http://127.0.0.1:8000/api/chat/send \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"message\": \"Test streaming\", \"stream\": true}' \\"
echo ""
echo "===============================================================\n"
echo "  END OF TESTS"
echo "===============================================================\n"
