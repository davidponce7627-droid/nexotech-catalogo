import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { KeyRound, Plus, Copy, Check, Trash2, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { AdminKey } from '../../types';

export const KeyGeneratorTab: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    generateNewAdminKey, 
    deleteAdminKey, 
    toggleAdminKey 
  } = useStore();

  const [label, setLabel] = useState('');
  const [role, setRole] = useState<'dueño' | 'administrador' | 'vendedor'>('administrador');
  const [customKey, setCustomKey] = useState('');
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<AdminKey | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [masterPin, setMasterPin] = useState(settings.adminPin || '5466915332');
  const [showMasterPin, setShowMasterPin] = useState(false);
  const [pinSaved, setPinSaved] = useState(false);
  const [adminGmail, setAdminGmail] = useState(settings.adminEmail || 'dr2490761@gmail.com');
  const [gmailSaved, setGmailSaved] = useState(false);
  const [testOtp, setTestOtp] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const handleToggleReveal = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (useCustomKey && customKey.trim()) {
      const newKey: AdminKey = {
        id: `key-${Date.now()}`,
        label: label.trim() || `Llave ${role.toUpperCase()}`,
        key: customKey.trim(),
        role,
        createdAt: new Date().toLocaleDateString('es-MX'),
        active: true
      };
      updateSettings({
        adminKeys: [newKey, ...(settings.adminKeys || [])]
      });
      setNewlyCreatedKey(newKey);
      setLabel('');
      setCustomKey('');
      setUseCustomKey(false);
    } else {
      const created = generateNewAdminKey(label || `Llave ${role.toUpperCase()}`, role);
      setNewlyCreatedKey(created);
      setLabel('');
    }
  };

  const handleCopy = (keyText: string, id: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ adminPin: masterPin.trim() });
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2000);
  };

  const handleSaveGmail = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ adminEmail: adminGmail.trim().toLowerCase() });
    setGmailSaved(true);
    setTimeout(() => setGmailSaved(false), 2000);
  };

  const handleGenerateTestOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setTestOtp(code);
  };

  const handleToggleSecurity = (enabled: boolean) => {
    updateSettings({ adminSecurityEnabled: enabled });
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">
            Generador de Llaves de Acceso y Control de Seguridad
          </p>
          <p>
            Genera llaves criptográficas únicas para dar acceso al panel a tus socios, técnicos o administradores sin compartir tu contraseña personal. Puedes activar, pausar o eliminar cualquier llave en cualquier momento.
          </p>
        </div>
      </div>

      {/* Security Switch & Master PIN */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Protección del Panel de Administración</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-slate-900 block">
              Exigir Llave de Seguridad al entrar al Panel
            </span>
            <span className="text-xs text-slate-500">
              Si está activado, cualquier persona que haga clic en "Panel Admin" deberá ingresar una llave válida.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.adminSecurityEnabled}
              onChange={(e) => handleToggleSecurity(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* PIN Maestro */}
        <form onSubmit={handleSavePin} className="pt-3 border-t border-slate-100 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              PIN Numérico Maestro de Respaldo
            </label>
            <div className="relative">
              <input
                type={showMasterPin ? 'text' : 'password'}
                required
                value={masterPin}
                onChange={(e) => setMasterPin(e.target.value)}
                placeholder="••••••••"
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:border-blue-600 w-44"
              />
              <button
                type="button"
                onClick={() => setShowMasterPin(!showMasterPin)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                title={showMasterPin ? "Ocultar" : "Mostrar"}
              >
                {showMasterPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {pinSaved ? '¡PIN Guardado!' : 'Actualizar PIN'}
          </button>
        </form>

        {/* Gmail Autorizado para Verificación Obligatoria */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <form onSubmit={handleSaveGmail} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Gmail Autorizado para Verificación de Acceso *
                </label>
                <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  Obligatorio para entrar
                </span>
              </div>
              <input
                type="email"
                required
                value={adminGmail}
                onChange={(e) => setAdminGmail(e.target.value)}
                placeholder="dr2490761@gmail.com"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {gmailSaved ? '¡Gmail Guardado!' : 'Actualizar Gmail'}
            </button>

            <button
              type="button"
              onClick={handleGenerateTestOtp}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 cursor-pointer"
              title="Probar generación de código OTP de 6 dígitos"
            >
              Probar Código OTP
            </button>
          </form>

          {testOtp && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-md text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
              <span>
                Código OTP de prueba generado para <strong>{settings.adminEmail}</strong>:
              </span>
              <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-emerald-400 text-emerald-800">
                {testOtp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Generator Tool */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Generar Nueva Llave de Acceso</span>
        </h3>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nombre / Usuario o Etiqueta
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ej. Administrador Principal, Devstsy..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Rol de Permiso
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none"
              >
                <option value="dueño">Dueño / Control Total</option>
                <option value="administrador">Administrador</option>
                <option value="vendedor">Vendedor / Taller</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{useCustomKey ? 'Guardar Llave' : 'Generar Llave'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomKey}
                onChange={(e) => setUseCustomKey(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Definir una clave o contraseña personalizada</span>
            </label>
          </div>

          {useCustomKey && (
            <div className="pt-2 animate-in fade-in">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Clave / Contraseña Secreta Personalizada
              </label>
              <input
                type="password"
                required
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Ingresa la contraseña personalizada (ej. MiClaveSegura2026)"
                className="w-full sm:max-w-md px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:border-blue-600"
              />
            </div>
          )}
        </form>

        {/* Success Alert when generated */}
        {newlyCreatedKey && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-md flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <div>
              <span className="font-bold text-emerald-900 block">
                ¡Nueva Llave Registrada con Éxito!
              </span>
              <span className="font-mono text-sm font-bold text-emerald-700">
                {newlyCreatedKey.key}
              </span>
              <span className="text-emerald-800 text-[11px] block">
                ({newlyCreatedKey.label} · Rol: {newlyCreatedKey.role})
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(newlyCreatedKey.key, 'new')}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 text-xs cursor-pointer"
            >
              {copiedKeyId === 'new' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Llave</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Keys Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Llaves de Acceso y Credenciales ({settings.adminKeys?.length || 0})
            </h4>
            <span className="text-[11px] text-slate-500">
              Las claves están ocultas por privacidad. Haz clic en el ícono de ojo para revelarlas o copiarlas.
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold text-[11px]">
                <th className="py-2.5 px-4">Usuario / Etiqueta</th>
                <th className="py-2.5 px-4">Clave Secreta</th>
                <th className="py-2.5 px-4">Rol</th>
                <th className="py-2.5 px-4">Fecha Creación</th>
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!settings.adminKeys || settings.adminKeys.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No hay llaves registradas. Genera una llave arriba para asegurar tu panel.
                  </td>
                </tr>
              ) : (
                settings.adminKeys.map(k => (
                  <tr key={k.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {k.label}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 tracking-wider">
                          {revealedKeys[k.id] ? k.key : `••••••••${k.key.length > 4 ? k.key.slice(-4) : ''}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleReveal(k.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer"
                          title={revealedKeys[k.id] ? "Ocultar clave" : "Mostrar clave"}
                        >
                          {revealedKeys[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(k.key, k.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer"
                          title="Copiar clave"
                        >
                          {copiedKeyId === k.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {k.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {k.createdAt}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAdminKey(k.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                          k.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        {k.active ? 'Activa ✓' : 'Inactiva / Bloqueada'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la llave "${k.label}"?`)) {
                            deleteAdminKey(k.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Eliminar llave"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
