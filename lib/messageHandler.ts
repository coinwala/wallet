// messageHandler.ts
interface MessageData {
    type: string;
    windowName: string;
    publicKey?: string;
    timestamp?: number;
    [key: string]: any;
  }
  
  class WindowMessenger {
    private allowedOrigins: string[];
    private processedMessages: Set<string> = new Set();
  
    constructor(allowedOrigins: string[]) {
      this.allowedOrigins = allowedOrigins;
    }
  
    private createMessageId(type: string, timestamp: number): string {
      return `${type}-${timestamp}`;
    }
  
    private isAllowedOrigin(origin: string): boolean {
      return this.allowedOrigins.some(allowed => origin === allowed);
    }
  
    sendPublicKey(publicKey: string, sessionData?: { dAppSessionId?: string; tipLinkSessionId?: string }) {
      if (!window.opener && !window.parent) {
        console.error("No parent or opener window found");
        return;
      }
  
      const message: MessageData = {
        type: "public_key",
        windowName: "default-window",
        publicKey,
        timestamp: Date.now(),
        ...sessionData
      };
  
      // Try sending to parent window first
      if (window.parent !== window) {
        this.allowedOrigins.forEach(origin => {
          try {
            window.parent.postMessage(message, origin);
            console.log(`Successfully sent public key to parent at ${origin}:`, message);
          } catch (err) {
            console.warn(`Failed to send to parent at ${origin}:`, err);
          }
        });
      }
  
      // Try sending to opener window if it exists
      if (window.opener) {
        this.allowedOrigins.forEach(origin => {
          try {
            window.opener.postMessage(message, origin);
            console.log(`Successfully sent public key to opener at ${origin}:`, message);
          } catch (err) {
            console.warn(`Failed to send to opener at ${origin}:`, err);
          }
        });
      }
    }
  
    setupMessageListener(onSuccess?: () => void) {
      const handleMessage = (event: MessageEvent<MessageData>) => {
        // Verify origin
        if (!this.isAllowedOrigin(event.origin)) {
          console.warn("Message received from unauthorized origin:", event.origin);
          return;
        }
  
        // Check for valid message data
        if (!event.data || typeof event.data !== "object") {
          console.warn("Invalid message format");
          return;
        }
  
        // Prevent duplicate processing
        const messageId = this.createMessageId(event.data.type, event.data.timestamp || Date.now());
        if (this.processedMessages.has(messageId)) return;
        this.processedMessages.add(messageId);
  
        // Clean up processed messages set if it gets too large
        if (this.processedMessages.size > 100) {
          this.processedMessages.clear();
        }
  
        // Handle acknowledgment
        if (event.data.type === "ack") {
          console.log("Received acknowledgment from parent");
          onSuccess?.();
        }
      };
  
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }
  
  export default WindowMessenger;