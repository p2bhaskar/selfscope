// src/components/SheetsPanel.jsx
// Google Sheets integration UI — shown in Settings page

export default function SheetsPanel({ sheetsState, showToast }) {
  const {
    isConnected, isLoading, error, lastSync, syncStatus,
    connect, disconnect, pullFromSheets, pushAllToSheets,
  } = sheetsState;

  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID || "";
  const clientId      = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const hasConfig     = spreadsheetId && clientId;

  const handleConnect = async () => {
    await connect();
    showToast("Connected to Google Sheets ✓");
  };

  const handlePull = async () => {
    showToast("Pulling from Sheets…");
    await pullFromSheets(); // reloads page after
  };

  const handlePush = async () => {
    showToast("Pushing local data to Sheets…");
    await pushAllToSheets();
    showToast("All data synced to Google Sheets ✓");
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header">
        <div className="card-title">Google Sheets Integration</div>
        <div
          className="card-badge"
          style={{
            background: isConnected ? "rgba(62,207,178,0.12)" : "rgba(107,114,128,0.15)",
            color: isConnected ? "var(--teal)" : "var(--muted)",
          }}
        >
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </div>
      </div>

      {/* Config status */}
      {!hasConfig ? (
        <div style={{
          padding: "14px 16px",
          background: "rgba(224,92,122,0.08)",
          border: "1px solid rgba(224,92,122,0.3)",
          borderRadius: 8,
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 13, color: "var(--rose)", fontWeight: 700, marginBottom: 6 }}>
            ⚠ Environment variables not set
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
            Create a <code style={{ color: "var(--gold)", background: "var(--surface2)", padding: "1px 6px", borderRadius: 4 }}>.env</code> file
            in your project root with:
          </div>
          <pre style={{
            marginTop: 10,
            padding: "10px 14px",
            background: "var(--surface2)",
            borderRadius: 6,
            fontSize: 12,
            color: "var(--teal)",
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1.8,
            overflowX: "auto",
          }}>
{`VITE_GOOGLE_CLIENT_ID=your_oauth_client_id_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here`}
          </pre>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
            See the Phase 3 guide for step-by-step Google Cloud Console setup.
          </div>
        </div>
      ) : (
        <div style={{
          padding: "10px 14px",
          background: "rgba(62,207,178,0.07)",
          border: "1px solid rgba(62,207,178,0.15)",
          borderRadius: 8,
          marginBottom: 14,
          fontSize: 12,
          color: "var(--teal)",
          fontFamily: "'DM Mono', monospace",
          display: "flex",
          gap: 20,
        }}>
          <span>CLIENT ID: •••{clientId.slice(-6)}</span>
          <span>SHEET ID: •••{spreadsheetId.slice(-6)}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: "10px 14px",
          background: "rgba(224,92,122,0.08)",
          border: "1px solid rgba(224,92,122,0.25)",
          borderRadius: 8,
          fontSize: 12,
          color: "var(--rose)",
          marginBottom: 14,
          fontFamily: "'DM Mono', monospace",
        }}>
          ✕ {error}
        </div>
      )}

      {/* Last sync */}
      {lastSync && (
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>
          Last sync: {lastSync.toLocaleTimeString()}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {!isConnected ? (
          <button
            className="btn btn-primary"
            onClick={handleConnect}
            disabled={!hasConfig || isLoading}
            style={{ flex: 1, opacity: !hasConfig ? 0.5 : 1 }}
          >
            {isLoading ? "Connecting…" : "⟳ Connect Google Account"}
          </button>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={handlePull}
              disabled={isLoading}
              style={{ flex: 1 }}
              title="Fetch latest data from Sheets → overwrite local"
            >
              {isLoading ? "Syncing…" : "↓ Pull from Sheets"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={handlePush}
              disabled={isLoading}
              style={{ flex: 1 }}
              title="Push all local data → Sheets (overwrites remote)"
            >
              {isLoading ? "Pushing…" : "↑ Push Local → Sheets"}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => { disconnect(); showToast("Disconnected"); }}
              style={{ flex: "0 0 auto" }}
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* Explanation */}
      <div style={{ marginTop: 16, fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
        {isConnected
          ? "All new data is automatically written to your Sheets. Pull syncs the latest from Sheets. Push overwrites Sheets with your local data."
          : "Connect your Google Account to enable cloud sync. Your data lives in your own Google Spreadsheet — you own it completely."}
      </div>

      {/* Sync status per tab */}
      {isConnected && Object.keys(syncStatus).length > 0 && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div className="section-heading">SYNC STATUS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(syncStatus).map(([tab, ts]) => (
              <div key={tab} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>
                <span>{tab}</span>
                <span style={{ color: "var(--teal)" }}>✓ {new Date(ts).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}