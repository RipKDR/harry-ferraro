'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Artwork } from '@/lib/artworks'
import {
  DEFAULT_PREVIEW_WIDTH_CM,
  PREVIEW_WIDTH_CM_MAX,
  PREVIEW_WIDTH_CM_MIN,
  previewAspectFor,
  previewHeightVmin,
  previewWidthVmin,
} from '@/lib/wall-preview'

type WallPreviewProps = {
  artwork: Artwork
}

type Point = { x: number; y: number }

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function stopMediaStream(streamRef: React.MutableRefObject<MediaStream | null>, video: HTMLVideoElement | null) {
  streamRef.current?.getTracks().forEach((track) => track.stop())
  streamRef.current = null
  if (video) video.srcObject = null
}

export function WallPreview({ artwork }: WallPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const artRef = useRef<HTMLDivElement | null>(null)
  const pinchRef = useRef<{ startDist: number; startScale: number } | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)

  const aspect = previewAspectFor(artwork)

  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraAttempt, setCameraAttempt] = useState(0)
  const [widthCm, setWidthCm] = useState(DEFAULT_PREVIEW_WIDTH_CM)
  const [pinchScale, setPinchScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showFrame, setShowFrame] = useState(true)
  const [showHelp, setShowHelp] = useState(true)
  const [captureMessage, setCaptureMessage] = useState<string | null>(null)

  const widthVmin = previewWidthVmin(widthCm) * pinchScale
  const heightVmin = previewHeightVmin(widthCm, aspect) * pinchScale

  useEffect(() => {
    let cancelled = false
    const video = videoRef.current

    async function bootCamera() {
      stopMediaStream(streamRef, video)

      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraReady(false)
          setCameraError('Camera access is not available in this browser.')
        }
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        const video = videoRef.current
        if (!video) return

        video.srcObject = stream
        await video.play()
        setCameraError(null)
        setCameraReady(true)
      } catch {
        if (!cancelled) {
          setCameraReady(false)
          setCameraError('Camera permission was denied or no camera was found. Allow camera access and try again.')
        }
      }
    }

    void bootCamera()

    return () => {
      cancelled = true
      stopMediaStream(streamRef, video)
    }
  }, [facingMode, cameraAttempt])

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    setShowHelp(false)
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || event.pointerType === 'touch') return
    const dx = event.clientX - dragRef.current.startX
    const dy = event.clientY - dragRef.current.startY
    setOffset({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy })
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return
    dragRef.current = null
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setShowHelp(false)
    if (event.touches.length === 2) {
      pinchRef.current = {
        startDist: distance(
          { x: event.touches[0].clientX, y: event.touches[0].clientY },
          { x: event.touches[1].clientX, y: event.touches[1].clientY },
        ),
        startScale: pinchScale,
      }
      return
    }
    if (event.touches.length === 1) {
      dragRef.current = {
        startX: event.touches[0].clientX,
        startY: event.touches[0].clientY,
        originX: offset.x,
        originY: offset.y,
      }
    }
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches.length === 2 && pinchRef.current) {
      event.preventDefault()
      const dist = distance(
        { x: event.touches[0].clientX, y: event.touches[0].clientY },
        { x: event.touches[1].clientX, y: event.touches[1].clientY },
      )
      const ratio = dist / pinchRef.current.startDist
      const next = Math.min(2.4, Math.max(0.45, pinchRef.current.startScale * ratio))
      setPinchScale(next)
      return
    }
    if (event.touches.length === 1 && dragRef.current) {
      const dx = event.touches[0].clientX - dragRef.current.startX
      const dy = event.touches[0].clientY - dragRef.current.startY
      setOffset({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy })
    }
  }

  function onTouchEnd() {
    dragRef.current = null
    pinchRef.current = null
  }

  function resetPlacement() {
    setOffset({ x: 0, y: 0 })
    setPinchScale(1)
    setWidthCm(DEFAULT_PREVIEW_WIDTH_CM)
  }

  async function capturePhoto() {
    const video = videoRef.current
    const art = artRef.current
    if (!video || !art || !cameraReady) return

    const rect = art.getBoundingClientRect()
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || window.innerWidth
    canvas.height = video.videoHeight || window.innerHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const scaleX = canvas.width / window.innerWidth
    const scaleY = canvas.height / window.innerHeight

    const x = rect.left * scaleX
    const y = rect.top * scaleY
    const w = rect.width * scaleX
    const h = rect.height * scaleY

    try {
      const painting = new window.Image()
      painting.crossOrigin = 'anonymous'
      painting.src = artwork.image
      await painting.decode()
      if (showFrame) {
        ctx.fillStyle = 'rgba(12,10,9,0.92)'
        ctx.fillRect(x - 6 * scaleX, y - 6 * scaleY, w + 12 * scaleX, h + 12 * scaleY)
      }
      ctx.shadowColor = 'rgba(0,0,0,0.55)'
      ctx.shadowBlur = 28 * scaleX
      ctx.drawImage(painting, x, y, w, h)
      ctx.shadowBlur = 0
    } catch {
      setCaptureMessage('Could not save — try again after the painting finishes loading.')
      window.setTimeout(() => setCaptureMessage(null), 3200)
      return
    }

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${artwork.slug}-wall-preview.jpg`
      anchor.click()
      URL.revokeObjectURL(url)
      setCaptureMessage('Saved to your photos/downloads.')
      window.setTimeout(() => setCaptureMessage(null), 3200)
    }, 'image/jpeg', 0.92)
  }

  const hint = cameraError ?? (!cameraReady ? 'Starting camera…' : null)

  return (
    <div className="wall-preview-root">
      <video ref={videoRef} className="wall-preview-video" playsInline muted autoPlay aria-hidden="true" />

      <header className="wall-preview-top">
        <Link href={`/gallery/${artwork.slug}`} className="wall-preview-chip">
          Close
        </Link>
        <p className="wall-preview-title">{artwork.title}</p>
        <button
          type="button"
          className="wall-preview-chip"
          onClick={() => {
            setCameraReady(false)
            setFacingMode((mode) => (mode === 'environment' ? 'user' : 'environment'))
          }}
        >
          Flip
        </button>
      </header>

      {hint && (
        <div className="wall-preview-hint" role="status">
          <p>{hint}</p>
          {cameraError && (
            <button type="button" className="btn-line mt-4" onClick={() => setCameraAttempt((value) => value + 1)}>
              Try again
            </button>
          )}
        </div>
      )}

      {cameraReady && (
        <>
          <div
            ref={artRef}
            className={`wall-preview-art ${showFrame ? 'wall-preview-art-framed' : ''}`}
            style={{
              width: `${widthVmin}vmin`,
              height: `${heightVmin}vmin`,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            role="img"
            aria-label={`${artwork.title} placed on your wall. Drag to move, pinch to resize.`}
          >
            <Image src={artwork.image} alt="" fill className="object-cover" sizes="80vw" priority draggable={false} />
          </div>

          {showHelp && (
            <div className="wall-preview-coach" role="note">
              <p>Point your phone at the wall. Drag the painting. Pinch to resize.</p>
              <button type="button" className="wall-preview-coach-dismiss" onClick={() => setShowHelp(false)}>
                Got it
              </button>
            </div>
          )}
        </>
      )}

      <div className="wall-preview-dock" aria-label="Preview controls">
        <label className="wall-preview-slider-label">
          <span>Approx. width · {widthCm} cm</span>
          <input
            type="range"
            min={PREVIEW_WIDTH_CM_MIN}
            max={PREVIEW_WIDTH_CM_MAX}
            value={widthCm}
            onChange={(event) => setWidthCm(Number(event.target.value))}
            aria-valuemin={PREVIEW_WIDTH_CM_MIN}
            aria-valuemax={PREVIEW_WIDTH_CM_MAX}
            aria-valuenow={widthCm}
          />
        </label>
        <div className="wall-preview-dock-actions">
          <button type="button" className="wall-preview-dock-btn" onClick={() => setShowFrame((value) => !value)}>
            {showFrame ? 'Frame on' : 'Frame off'}
          </button>
          <button type="button" className="wall-preview-dock-btn" onClick={resetPlacement}>
            Reset
          </button>
          <button type="button" className="wall-preview-dock-btn wall-preview-dock-btn-primary" onClick={() => void capturePhoto()} disabled={!cameraReady}>
            Save shot
          </button>
        </div>
        {captureMessage && <p className="wall-preview-capture-msg">{captureMessage}</p>}
        <p className="wall-preview-disclaimer">Guide only — lighting, distance, and lens affect scale.</p>
      </div>
    </div>
  )
}