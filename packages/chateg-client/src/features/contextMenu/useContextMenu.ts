import { useState, MouseEvent, useRef, useCallback, useEffect } from "react";

type Coords = {
  x: number;
  y: number;
};

export const useContextMenu = () => {
  const [menuPosition, setMenuPosition] = useState<Coords | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const handleContextClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (!ref.current) return;

    const clickPosition = { x: e.clientX, y: e.clientY };

    const menuRect = ref.current.getBoundingClientRect();
    const isHorizontalOverlap =
      window.innerWidth < menuRect.width + clickPosition.x;
    const isVerticalOverlap =
      window.innerHeight < menuRect.height + clickPosition.y;

    const finalPosition = {
      x: isHorizontalOverlap
        ? clickPosition.x - menuRect.width
        : clickPosition.x,
      y: isVerticalOverlap
        ? clickPosition.y - menuRect.height
        : clickPosition.y,
    };

    setMenuPosition(finalPosition);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setMenuPosition(null);
  }, []);

  useEffect(() => {
    // Добавляем обработчик события на весь документ для закрытия контекстного меню
    document.addEventListener("click", handleCloseContextMenu);
    return () => {
      document.removeEventListener("click", handleCloseContextMenu);
    };
  }, [handleCloseContextMenu]);

  return {
    handleContextClick,
    menuPosition,
    ref,
  };
};
