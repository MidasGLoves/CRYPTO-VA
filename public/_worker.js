export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Handle Form Submissions
    if (request.method === 'POST' && url.pathname === '/api/submit') {
      try {
        const body = await request.json();
        const submission = { ...body, timestamp: new Date().toISOString() };
        
        // Retrieve existing submissions from KV
        let submissions = [];
        const existing = await env.SUBMISSIONS_KV.get('all_submissions');
        if (existing) {
          submissions = JSON.parse(existing);
        }
        
        // Add new submission and save back to KV
        submissions.push(submission);
        await env.SUBMISSIONS_KV.put('all_submissions', JSON.stringify(submissions));
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // 2. Handle Admin Password Verification & Data Retrieval
    if (request.method === 'POST' && url.pathname === '/api/verify-password') {
      try {
        const body = await request.json();
        if (body.password === 'Somena') {
          const existing = await env.SUBMISSIONS_KV.get('all_submissions');
          const submissions = existing ? JSON.parse(existing) : [];
          
          return new Response(JSON.stringify({ success: true, submissions }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
        return new Response(JSON.stringify({ success: false }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // 3. Handle Hidden Download Link
    if (url.pathname === '/api/download') {
      try {
        const mediafireUrl = 'https://www.mediafire.com/file/wtd6ukp5738utl6/1_PESO.zip/file';
        const response = await fetch(mediafireUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await response.text();
        
        const match1 = html.match(/href="([^"]+)"[^>]*id="downloadButton"/i);
        const match2 = html.match(/id="downloadButton"[^>]*href="([^"]+)"/i);
        const directLink = (match1 && match1[1]) || (match2 && match2[1]);
        
        if (directLink) {
          // Redirect the user to the direct link (hides the mediafire UI)
          return Response.redirect(directLink, 302);
        }
        return new Response('Download link not found', { status: 404, headers: corsHeaders });
      } catch (e) {
        return new Response('Error processing download', { status: 500, headers: corsHeaders });
      }
    }

    // 4. Serve the React Frontend (Fallback to Cloudflare Pages assets)
    return env.ASSETS.fetch(request);
  }
};
