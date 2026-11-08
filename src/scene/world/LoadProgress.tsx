import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useOmni } from "../../state/store";

export default function LoadProgress() {
  const { progress, active } = useProgress();
  useEffect(() => {
    queueMicrotask(() => {
      useOmni.getState().setLoadProgress(active ? progress : 100);
    });
  }, [active, progress]);
  return null;
}
