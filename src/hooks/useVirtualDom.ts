import { useEffect, useState } from 'react'

export const useVirtualDom = () => {
  const [VD, setVD] = useState<Document>()

  return { VD, setVD }
}
