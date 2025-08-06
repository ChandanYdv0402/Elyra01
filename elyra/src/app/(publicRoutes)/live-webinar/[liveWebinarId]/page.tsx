import { getWebinarById } from '@/action/webinar'

type Props = {
  params: Promise<{ liveWebinarId: string }>
  searchParams: Promise<{ error: string }>
}

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params
  const { error } = await searchParams

  const webinarData = await getWebinarById(liveWebinarId)
  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        Webinar not found
      </div>
    )
  }

  return <div>Webinar loaded</div>
}

export default page
