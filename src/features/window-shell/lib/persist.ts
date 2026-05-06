import type { Geometry } from "./geometry";

const KEY_X = (id: string) => `${id}x`;
const KEY_Y = (id: string) => `${id}y`;
const KEY_W = (id: string) => `${id}w`;
const KEY_H = (id: string) => `${id}h`;

export function loadGeometry(id: string): Geometry | null {
    const raw = {
        x: localStorage.getItem(KEY_X(id)),
        y: localStorage.getItem(KEY_Y(id)),
        w: localStorage.getItem(KEY_W(id)),
        h: localStorage.getItem(KEY_H(id)),
    };
    if (raw.x == null || raw.y == null || raw.w == null || raw.h == null) {
        return null;
    }
    const x = Number(raw.x);
    const y = Number(raw.y);
    const w = Number(raw.w);
    const h = Number(raw.h);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(w) || !Number.isFinite(h)) {
        return null;
    }
    return { x, y, w, h };
}

export function saveGeometry(id: string, geom: Geometry): void {
    localStorage.setItem(KEY_X(id), String(geom.x));
    localStorage.setItem(KEY_Y(id), String(geom.y));
    localStorage.setItem(KEY_W(id), String(geom.w));
    localStorage.setItem(KEY_H(id), String(geom.h));
}

export function clearGeometry(id: string): void {
    localStorage.removeItem(KEY_X(id));
    localStorage.removeItem(KEY_Y(id));
    localStorage.removeItem(KEY_W(id));
    localStorage.removeItem(KEY_H(id));
}
