import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/** biome-ignore lint/a11y/useButtonType: template */}
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </>
  )
}

export default App
