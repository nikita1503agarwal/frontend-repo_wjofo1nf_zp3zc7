import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Pencil, Square, Circle, Slash, Eraser, Undo, Redo, Trash2, Download, Hand } from 'lucide-react';

const TOOLS = {
  PEN: 'pen',
  LINE: 'line',
  RECT: 'rect',
  ELLIPSE: 'ellipse',
  ERASER: 'eraser',
  HAND: 'hand',
};

export default function EditorCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState('#111827');
  const [thickness, setThickness] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [history, setHistory] = useState([]); // list of actions
  const [redoStack, setRedoStack] = useState([]);

  const dpi = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  const actionPreview = useRef(null);

  const size = useMemo(() => ({ width: 1600, height: 900 }), []);

  // Resize canvas for crisp rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.width * dpi;
    canvas.height = size.height * dpi;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpi, dpi);
    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dpi, size.width, size.height]);

  useEffect(() => {
    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, pan]);

  function drawAll(preview) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // clear to white background
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size.width, size.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);

    history.forEach((a) => drawAction(ctx, a));
    if (preview) drawAction(ctx, preview, true);

    ctx.restore();
  }

  function drawAction(ctx, a, dashed = false) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = a.tool === TOOLS.ERASER ? '#ffffff' : a.color;
    ctx.fillStyle = a.color;
    ctx.lineWidth = a.thickness;
    if (dashed) ctx.setLineDash([6, 6]); else ctx.setLineDash([]);

    switch (a.tool) {
      case TOOLS.PEN: {
        ctx.beginPath();
        a.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        break;
      }
      case TOOLS.ERASER: {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        a.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
        break;
      }
      case TOOLS.LINE: {
        const { x, y, x2, y2 } = a;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        break;
      }
      case TOOLS.RECT: {
        const { x, y, w, h } = a;
        ctx.beginPath();
        ctx.strokeRect(x, y, w, h);
        break;
      }
      case TOOLS.ELLIPSE: {
        const { x, y, w, h } = a;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      default:
        break;
    }
  }

  function getRelativePos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) - pan.x, y: (clientY - rect.top) - pan.y };
  }

  function onPointerDown(e) {
    if (tool === TOOLS.HAND) {
      setIsPanning(true);
      setStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const pos = getRelativePos(e);
    setIsDrawing(true);
    setStart(pos);

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      actionPreview.current = {
        tool,
        color,
        thickness,
        points: [pos],
      };
    }
  }

  function onPointerMove(e) {
    if (tool === TOOLS.HAND && isPanning) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      setStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing) return;
    const pos = getRelativePos(e);

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      actionPreview.current.points.push(pos);
      drawAll(actionPreview.current);
    } else if (tool === TOOLS.LINE) {
      actionPreview.current = {
        tool,
        color,
        thickness,
        x: start.x,
        y: start.y,
        x2: pos.x,
        y2: pos.y,
      };
      drawAll(actionPreview.current);
    } else if (tool === TOOLS.RECT || tool === TOOLS.ELLIPSE) {
      const w = pos.x - start.x;
      const h = pos.y - start.y;
      actionPreview.current = { tool, color, thickness, x: start.x, y: start.y, w, h };
      drawAll(actionPreview.current);
    }
  }

  function commitPreview() {
    if (!actionPreview.current) return;
    setHistory((h) => [...h, actionPreview.current]);
    setRedoStack([]);
    actionPreview.current = null;
  }

  function onPointerUp() {
    if (tool === TOOLS.HAND && isPanning) {
      setIsPanning(false);
      return;
    }
    setIsDrawing(false);
    commitPreview();
  }

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const copy = h.slice();
      const last = copy.pop();
      setRedoStack((r) => [last, ...r]);
      return copy;
    });
  }

  function redo() {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const [next, ...rest] = r;
      setHistory((h) => [...h, next]);
      return rest;
    });
  }

  function clearAll() {
    setHistory([]);
    setRedoStack([]);
    drawAll();
  }

  function downloadPNG() {
    // render current canvas to PNG
    const link = document.createElement('a');
    link.download = 'doodlelabs-canvas.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.shiftKey ? redo() : undo();
      }
      if (e.key === ' ') setTool(TOOLS.HAND);
      if (e.key === 'p') setTool(TOOLS.PEN);
      if (e.key === 'l') setTool(TOOLS.LINE);
      if (e.key === 'r') setTool(TOOLS.RECT);
      if (e.key === 'e') setTool(TOOLS.ELLIPSE);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="editor" className="bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 p-3 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-1.5">
              <ToolButton active={tool === TOOLS.HAND} onClick={() => setTool(TOOLS.HAND)} title="Hand (space)">
                <Hand size={16} />
              </ToolButton>
              <ToolButton active={tool === TOOLS.PEN} onClick={() => setTool(TOOLS.PEN)} title="Pen (P)">
                <Pencil size={16} />
              </ToolButton>
              <ToolButton active={tool === TOOLS.LINE} onClick={() => setTool(TOOLS.LINE)} title="Line (L)">
                <Slash size={16} />
              </ToolButton>
              <ToolButton active={tool === TOOLS.RECT} onClick={() => setTool(TOOLS.RECT)} title="Rectangle (R)">
                <Square size={16} />
              </ToolButton>
              <ToolButton active={tool === TOOLS.ELLIPSE} onClick={() => setTool(TOOLS.ELLIPSE)} title="Ellipse (E)">
                <Circle size={16} />
              </ToolButton>
              <ToolButton active={tool === TOOLS.ERASER} onClick={() => setTool(TOOLS.ERASER)} title="Eraser">
                <Eraser size={16} />
              </ToolButton>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <label className="flex items-center gap-2 text-xs text-slate-600">
              Color
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-6 w-10 p-0 border border-slate-300 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-600">
              Stroke
              <input
                type="range"
                min="1"
                max="24"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-slate-700 font-medium w-6 text-right">{thickness}</span>
            </label>

            <div className="ml-auto flex items-center gap-1.5">
              <ToolButton onClick={undo} title="Undo (Ctrl/Cmd+Z)"><Undo size={16} /></ToolButton>
              <ToolButton onClick={redo} title="Redo (Ctrl/Cmd+Shift+Z)"><Redo size={16} /></ToolButton>
              <ToolButton onClick={clearAll} title="Clear"><Trash2 size={16} /></ToolButton>
              <ToolButton onClick={downloadPNG} title="Export PNG"><Download size={16} /></ToolButton>
            </div>
          </div>

          {/* Canvas */}
          <div ref={containerRef} className="bg-[conic-gradient(at_top_left,_#f8fafc,_#f1f5f9)] p-4">
            <div className="mx-auto max-w-full overflow-auto">
              <div className="rounded-xl border border-slate-200 shadow-sm bg-white inline-block" style={{ lineHeight: 0 }}>
                <canvas
                  ref={canvasRef}
                  width={size.width}
                  height={size.height}
                  onMouseDown={onPointerDown}
                  onMouseMove={onPointerMove}
                  onMouseUp={onPointerUp}
                  onMouseLeave={onPointerUp}
                  onTouchStart={(e) => { e.preventDefault(); onPointerDown(e); }}
                  onTouchMove={(e) => { e.preventDefault(); onPointerMove(e); }}
                  onTouchEnd={(e) => { e.preventDefault(); onPointerUp(); }}
                  className="cursor-crosshair select-none"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Tips: Hold space for hand tool. Ctrl/Cmd+Z to undo. Use color and stroke controls for style.</p>
      </div>
    </section>
  );
}

function ToolButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-md border ${active ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
    >
      {children}
    </button>
  );
}
