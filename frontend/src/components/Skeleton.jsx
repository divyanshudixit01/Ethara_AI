const Skeleton = ({ className = "", style = {}, ...props }) => (
  <div className="eth-skeleton" style={style} {...props} />
);

export const CardSkeleton = () => (
  <div className="eth-card" style={{ padding: 20 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="eth-skeleton" style={{ height: 36, width: 36, borderRadius: "50%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="eth-skeleton" style={{ height: 14, width: "60%" }} />
          <div className="eth-skeleton" style={{ height: 10, width: "35%" }} />
        </div>
      </div>
      <div className="eth-skeleton" style={{ height: 60, width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="eth-skeleton" style={{ height: 12, width: 80 }} />
        <div className="eth-skeleton" style={{ height: 20, width: 60, borderRadius: 999 }} />
      </div>
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div className="eth-card" style={{ padding: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="eth-skeleton" style={{ height: 12, width: 80 }} />
        <div className="eth-skeleton" style={{ height: 28, width: 48 }} />
      </div>
      <div className="eth-skeleton" style={{ height: 36, width: 36, borderRadius: "var(--radius-md)" }} />
    </div>
  </div>
);

export default Skeleton;
