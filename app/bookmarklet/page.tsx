import Bookmarklet from "@/components/Bookmarklet";
import React from "react";

export const metadata = {
  title: "Enable Hyperlink on Twitter",
  description: "Install the Hyperlink bookmarklet for Twitter integration",
};

export default function BookmarkletPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Enable Hyperlink on Twitter</h1>

      <div className="space-y-6">
        <p>To use Hyperlink directly on Twitter, follow these steps:</p>

        <ol className="list-decimal ml-6 space-y-2">
          <li>Make sure your bookmarks bar is visible</li>
          <li>Drag the button below to your bookmarks bar</li>
          <li>When on Twitter, click the bookmark to enable Hyperlink</li>
        </ol>

        <Bookmarklet />
      </div>
    </div>
  );
}
