import { useBalance } from 'wagmi'
import { mainnet } from 'wagmi/chains'

function App() {
  const result = useBalance({
    address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
    chainId: mainnet.id,
  })
}