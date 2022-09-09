import { useEffect, useState } from 'react'

export const useVirtualDom = () => {
  const [VD, setVD] = useState<Document>()
  console.log(VD)

  return { VD, setVD }
}
