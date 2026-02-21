type UnauthorizedListener = () => void;

class AuthEventEmitter {
    private listeners: Set<UnauthorizedListener> = new Set();
    private isLogoutInProgress = false;
    private logoutTimeout: number | null = null;

    subscribe(listener: UnauthorizedListener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    emit() {
        if (this.isLogoutInProgress) {
            return;
        }

        this.isLogoutInProgress = true;

        this.listeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.error("Error en listener de logout:", error);
            }
        });

        if (this.logoutTimeout) {
            clearTimeout(this.logoutTimeout);
        }
        this.logoutTimeout = setTimeout(() => {
            this.isLogoutInProgress = false;
        }, 1000);
    }

    clear() {
        this.listeners.clear();
        this.isLogoutInProgress = false;
        if (this.logoutTimeout) {
            clearTimeout(this.logoutTimeout);
        }
    }
}

export const authEvents = new AuthEventEmitter();
