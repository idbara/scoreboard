import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('badminton_match_active_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-bg p-6 text-center text-slate-200">
          <div className="mb-4 text-5xl">🏸</div>
          <h1 className="text-xl font-black text-white">Terjadi Kendala Teknis</h1>
          <p className="mt-2 max-w-sm text-xs text-slate-400">
            Aplikasi mengalami galat tak terduga. Skor Anda aman dan Anda dapat memuat ulang halaman.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
            <button
              onClick={this.handleReload}
              className="rounded-xl bg-accent px-4 py-2.5 text-xs font-black uppercase tracking-wider text-dark-bg shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 active:scale-95"
            >
              🔄 Muat Ulang Halaman
            </button>
            <button
              onClick={this.handleReset}
              className="rounded-xl border border-white/10 bg-dark-surface1 px-4 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-white/10 active:scale-95"
            >
              Mulai Ulang Pertandingan
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
