'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { JobUpdatePayload } from '@/types';

export function useJobUpdates(onUpdate: (payload: JobUpdatePayload) => void) {
  const callbackRef = useRef(onUpdate);

  useEffect(() => {
    const socket = getSocket();

    const handler = (payload: JobUpdatePayload) => {
      callbackRef.current(payload);
    };

    socket.on('jobs:changed', handler);
    return () => {
      socket.off('jobs:changed', handler);
    };
  }, []);
}

export function useJobSubscription(
  jobId: string | null,
  onUpdate: (payload: JobUpdatePayload) => void,
) {
  const callbackRef = useRef(onUpdate);

  useEffect(() => {
    if (!jobId) return;

    const socket = getSocket();

    const handler = (payload: JobUpdatePayload) => {
      callbackRef.current(payload);
    };

    socket.emit('subscribe', jobId);
    socket.on('job:update', handler);

    return () => {
      socket.emit('unsubscribe', jobId);
      socket.off('job:update', handler);
    };
  }, [jobId]);
}
