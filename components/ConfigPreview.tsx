const SAMPLE = `upstream-config:
  upstreams:
    - id: drpc-ethereum
      chain: ethereum
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/ethereum/YOUR_DRPC_KEY
    - id: drpc-base
      chain: base
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/base/YOUR_DRPC_KEY`

export default function ConfigPreview() {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-[13px] font-medium text-gray-900">nodecore.yml</p>
        <p className="mt-0.5 text-[12px] text-gray-400">Generated for Ethereum and Base. Replace YOUR_DRPC_KEY with your own key.</p>
      </div>
      <pre className="codeblock overflow-x-auto border-t border-black/5 px-5 py-4">{SAMPLE}</pre>
    </div>
  )
}
