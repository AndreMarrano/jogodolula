import type { Settings, TouchControlsMode } from "../game/systems/settings";

interface Props {
  settings: Settings;
  onChange: (next: Settings) => void;
}

export function SettingsForm({ settings, onChange }: Props) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value });
  return (
    <div className="settings">
      <label className="field">
        <span>Volume dos efeitos: {Math.round(settings.volume * 100)}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={Math.round(settings.volume * 100)}
          onChange={(e) => set("volume", Number(e.target.value) / 100)}
        />
      </label>
      <label className="field field--check">
        <input type="checkbox" checked={settings.muted} onChange={(e) => set("muted", e.target.checked)} />
        <span>Sem som</span>
      </label>
      <label className="field field--check">
        <input
          type="checkbox"
          checked={settings.reducedMotion}
          onChange={(e) => set("reducedMotion", e.target.checked)}
        />
        <span>Reduzir movimento (sem tremidas, piscadas e transições)</span>
      </label>
      <label className="field">
        <span>Controles de toque</span>
        <select
          value={settings.touchControls}
          onChange={(e) => set("touchControls", e.target.value as TouchControlsMode)}
        >
          <option value="auto">Automático (aparecem em telas de toque)</option>
          <option value="on">Sempre mostrar</option>
          <option value="off">Nunca mostrar</option>
        </select>
      </label>
    </div>
  );
}
