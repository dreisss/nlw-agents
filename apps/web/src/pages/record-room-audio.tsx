import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  type PostUploadAudioMutationRequest,
  type PostUploadAudioPathParams,
  usePostUploadAudio,
} from '@/kubb'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

export function RecordRoomAudio() {
  const { roomId } = useParams<PostUploadAudioPathParams>()

  const { mutateAsync: postUploadAudio } = usePostUploadAudio()

  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)

  const instervalRef = useRef<NodeJS.Timeout>(null)

  if (!roomId) {
    return <Navigate replace to="/" />
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm;codec=opus',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }

    recorder.current.start()
  }

  function stopRecording() {
    setIsRecording(false)

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }

    if (instervalRef.current) {
      clearInterval(instervalRef.current)
    }
  }

  async function uploadAudio(audio: Blob) {
    if (!roomId) {
      return <Navigate replace to="/" />
    }

    const formData = new FormData()
    formData.append('file', audio)

    await postUploadAudio({
      roomId,
      data: formData as unknown as PostUploadAudioMutationRequest,
    })
  }

  async function startRecording() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    })

    createRecorder(audio)

    if (!isRecordingSupported) {
      alert('O seu navegador não suporta gravação')
      return
    }

    setIsRecording(true)

    instervalRef.current = setInterval(() => {
      recorder.current?.stop()

      createRecorder(audio)
    }, 5000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Pausar gravação</Button>
      ) : (
        <Button onClick={startRecording}>Gravar áudio</Button>
      )}

      <p>{isRecording ? 'Gravando...' : 'Pausado'}</p>
    </div>
  )
}
