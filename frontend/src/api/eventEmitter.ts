type UnauthorizedListener = () => void;

class AuthEventEmitter {
    private listeners: Set<UnauthorizedListener> = new Set();

    subscribe(listener: UnauthorizedListener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    emit() {
        this.listeners.forEach(listener => listener());
    }

    clear() {
        this.listeners.clear();
    }
}

export const authEvents = new AuthEventEmitter();
