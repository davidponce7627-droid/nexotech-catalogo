import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Download, Upload, RotateCcw, Check, FileJson } from 'lucide-react';

export const BackupManager: React.FC = () => {
  const { exportBackup, importBackup, resetToDefaults, products, categories } = useStore();
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo_catalogo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        setImportStatus('¡Respaldo importado correctamente con todos los productos y configuraciones!');
      } else {
        setImportStatus('Error: El archivo no tiene un formato JSON válido.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5">
      
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Respaldo, Exportación y Mantenimiento del Catálogo
        </h3>
        <p className="text-xs text-slate-500">
          Descarga un archivo con tus {products.length} productos, precios y configuraciones para guardarlo en tu computadora o pasarlo a otro dispositivo.
        </p>
      </div>

      {importStatus && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Export Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Descargar Copia JSON</h4>
            <p className="text-xs text-slate-500">
              Crea un archivo descargable con todas las refacciones, precios de menudeo, mayoreo y datos de la tienda.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-2.5 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Archivo JSON</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Restaurar desde JSON</h4>
            <p className="text-xs text-slate-500">
              Selecciona un archivo JSON generado previamente para cargar automáticamente tu catálogo.
            </p>
          </div>

          <label className="w-full py-2.5 px-3 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer text-center">
            <FileJson className="w-4 h-4 text-emerald-600" />
            <span>Cargar Archivo JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Valores de Fábrica</h4>
            <p className="text-xs text-slate-500">
              Restaura las piezas y refacciones demostrativas iniciales (puertos Type-C, pantallas OLED y celulares).
            </p>
          </div>

          <button
            onClick={resetToDefaults}
            className="w-full py-2.5 px-3 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Catálogo Base</span>
          </button>
        </div>

      </div>

    </div>
  );
};
