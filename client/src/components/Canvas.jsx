import { useEffect, useRef } from 'react';
import { socket } from '../utils/socket';

const Canvas = ({ roomId, isDrawer }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Set drawing styles
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'white';
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  useEffect(() => {
    const ctx = ctxRef.current;
    socket.on('draw_data', ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    return () => {
      socket.off('draw_data');
    };
  }, []);

  const getOffset = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    if (!isDrawer) return;
    const { x, y } = getOffset(e.nativeEvent);
    drawingRef.current = true;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const handleMouseMove = (e) => {
    if (!drawingRef.current || !isDrawer) return;
    const { x, y } = getOffset(e.nativeEvent);
    socket.emit('draw', { roomId, data: { x, y } });
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const handleMouseUp = () => {
    if (!isDrawer) return;
    drawingRef.current = false;
    ctxRef.current.closePath();
  };

  return (
    <canvas
      className="h-[40vh] lg:h-[60vh] w-[95vw] lg:w-[47vw] border-4 border-[#00f5d4] bg-[#1e1e2f] rounded-lg shadow-[0_0_10px_#00f5d4]"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Canvas;
