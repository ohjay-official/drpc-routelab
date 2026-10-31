const SAMPLE = `upstream-config:
  upstreams:
    - id: drpc-ethereum
      chain: ethereum
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/ethereum/\${DRPC_KEY}
    - id: drpc-base
      chain: base
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/base/\${DRPC_KEY}`

export default function ConfigPreview() {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-[13px] font-medium text-gray-900">nodecore.yml</p>
        <p className="mt-0.5 text-[12px] text-gray-400">Generated for Ethereum and Base. The key stays in the environment.</p>
      </div>
      <pre className="codeblock overflow-x-auto border-t border-black/5 px-5 py-4">{SAMPLE}</pre>
    </div>
  )
}
