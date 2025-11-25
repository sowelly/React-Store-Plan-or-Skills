import { useEffect, useState } from 'react'

export default function useHydratedClient() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])
  return hydrated
}

