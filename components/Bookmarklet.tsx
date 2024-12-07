"use client";
import React, { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";

const Bookmarklet = () => {
  const [copied, setCopied] = useState(false);

  // Bookmarklet code with proper escaping and formatting
  const bookmarkletCode = encodeURI(`javascript:(function(){
    if(window.autoBookmarkletInjected) {
      console.log('Bookmarklet already injected');
      return;
    }
    window.autoBookmarkletInjected = true;
    
    function logPageInfo() {
      console.log('Auto-running bookmarklet activated!');
      console.log('Current URL:', window.location.href);
      console.log('Page title:', document.title);
    }
    
    function watchForTweets() {
      const observer = new MutationObserver(function(mutations) {
        const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
        if (tweetElements.length > 0) {
          console.log('Found', tweetElements.length, 'tweets on the page');
          tweetElements.forEach(function(tweet, index) {
            console.log('Tweet', index + 1, ':', tweet.innerText);
          });
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('Tweet observer started');
    }
    
    logPageInfo();
    watchForTweets();
  })()`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decodeURI(bookmarkletCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Auto Console Logger</h3>

      <p className="text-sm text-gray-600 mb-4">
        Drag this button to your bookmarks bar to enable automatic console
        logging:
      </p>

      <div className="flex gap-4 items-center">
        <a
          href={bookmarkletCode}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={(e) => e.preventDefault()}
          draggable="true"
        >
          CoinWala.io
        </a>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
          aria-label="Copy bookmarklet code"
        >
          {copied ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: Open your browser's console (F12) to see the logged information
      </p>
    </div>
  );
};

export default Bookmarklet;
