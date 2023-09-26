import './statusbar.css'
export default function StatusBar({ text }) {
    return <p className="status-bar">
        <span style={{ fontWeight: "bold" }}>{text}</span>
    </p>;
};