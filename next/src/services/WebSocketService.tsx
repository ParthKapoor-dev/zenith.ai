// services/WebSocketService.ts

interface WebSocketConfig {
    url: string;
    onMessage: (data: any) => void;
    onError: (error: Event) => void;
    onClose: (event: CloseEvent) => void;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private config: WebSocketConfig;

    constructor(config: WebSocketConfig) {
        this.config = config;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.config.url);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    this.config.onMessage(data);
                };

                this.ws.onerror = this.config.onError;
                this.ws.onclose = this.config.onClose;
            } catch (error) {
                reject(error);
            }
        });
    }

    async sendMessage(message: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                reject(new Error('WebSocket is not connected'));
                return;
            }

            try {
                this.ws.send(JSON.stringify(message));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}