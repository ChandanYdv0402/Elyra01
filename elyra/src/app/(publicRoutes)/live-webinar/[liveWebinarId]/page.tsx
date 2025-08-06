import { getWebinarById } from '@/action/webinar'
import { onAuthenticateUser } from '@/action/auth'
import { getStreamRecording } from '@/action/streamIo'

type Props = {
  params: Promise<{ liveWebinarId: string }>
  searchParams: Promise<{ error: string }>
}

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params
  const { error } = await searchParams

  const checkUser = await onAuthenticateUser()
  const webinarData = await getWebinarById(liveWebinarId)

  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        Webinar not found
      </div>
    )
  }

  let recording = null
  if (webinarData.webinarStatus === 'ENDED') {
    recording = await getStreamRecording(webinarData.id)
    console.log('Loaded recording:', recording)
  }

  return (
    <div className="w-full min-h-screen mx-auto">
      <p>Recording data: {recording ? 'available' : 'none'}</p>
    </div>
  )
}

export default page
