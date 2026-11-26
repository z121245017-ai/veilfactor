import Foundation
import AVFoundation
import CoreGraphics
import ImageIO
import AppKit

let args = CommandLine.arguments
let framesDir = args.count > 1 ? args[1] : "docs/frames"
let outVideo = args.count > 2 ? args[2] : "docs/demo.mp4"
let outLogo = args.count > 3 ? args[3] : "docs/veilfactor_logo.png"

func drawText(_ ctx: CGContext, text: String, rect: CGRect, fontSize: CGFloat, weight: NSFont.Weight, color: NSColor, align: NSTextAlignment = .center, mono: Bool = false) {
    let font: NSFont = mono ? NSFont.monospacedSystemFont(ofSize: fontSize, weight: weight) : NSFont.systemFont(ofSize: fontSize, weight: weight)
    let para = NSMutableParagraphStyle()
    para.alignment = align
    para.lineBreakMode = .byWordWrapping
    let attrs: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: color, .paragraphStyle: para]
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: true)
    NSAttributedString(string: text, attributes: attrs).draw(in: rect)
    NSGraphicsContext.restoreGraphicsState()
}

// 1. Render 512x512 square VeilFactor Logo PNG
do {
    let s = 512
    guard let ctx = CGContext(data: nil, width: s, height: s, bitsPerComponent: 8, bytesPerRow: s * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { fatalError() }
    ctx.translateBy(x: 0, y: CGFloat(s)); ctx.scaleBy(x: 1, y: -1)
    ctx.setFillColor(NSColor(red: 0.027, green: 0.039, blue: 0.071, alpha: 1).cgColor)
    ctx.fill(CGRect(x: 0, y: 0, width: s, height: s))
    ctx.setStrokeColor(NSColor(red: 0.486, green: 0.424, blue: 0.965, alpha: 0.5).cgColor)
    ctx.setLineWidth(6)
    ctx.stroke(CGRect(x: 26, y: 26, width: s - 52, height: s - 52))

    // Shield emblem for ZK Invoice Factoring
    let shield = CGMutablePath()
    shield.move(to: CGPoint(x: 256, y: 78))
    shield.addLine(to: CGPoint(x: 382, y: 126))
    shield.addLine(to: CGPoint(x: 368, y: 274))
    shield.addLine(to: CGPoint(x: 256, y: 368))
    shield.addLine(to: CGPoint(x: 144, y: 274))
    shield.addLine(to: CGPoint(x: 130, y: 126))
    shield.closeSubpath()
    ctx.setFillColor(NSColor(red: 0.486, green: 0.424, blue: 0.965, alpha: 0.18).cgColor)
    ctx.addPath(shield); ctx.fillPath()
    ctx.setStrokeColor(NSColor(red: 0.133, green: 0.827, blue: 0.933, alpha: 0.95).cgColor)
    ctx.setLineWidth(10)
    ctx.addPath(shield); ctx.strokePath()

    // Inner VF monogram
    drawText(ctx, text: "VF", rect: CGRect(x: 130, y: 158, width: 252, height: 128), fontSize: 108, weight: .heavy, color: .white)
    drawText(ctx, text: "VEILFACTOR", rect: CGRect(x: 40, y: 402, width: 432, height: 52), fontSize: 38, weight: .bold, color: NSColor(red: 0.404, green: 0.910, blue: 0.976, alpha: 1), mono: true)

    let url = URL(fileURLWithPath: outLogo)
    try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
    guard let img = ctx.makeImage(), let dest = CGImageDestinationCreateWithURL(url as CFURL, "public.png" as CFString, 1, nil) else { fatalError() }
    CGImageDestinationAddImage(dest, img, nil)
    guard CGImageDestinationFinalize(dest) else { fatalError() }
    print("Rendered logo:", outLogo)
}

// 2. Render 1280x720 HD Demo Video
struct Slide { let img: String?; let badge: String; let title: String; let sub: String; let cap: String; let dur: Double }
let slides: [Slide] = [
    Slide(img: nil, badge: "MIDNIGHT BUILDATHON WAVE 3 · COMPACT 0.36.1 · LEDGER 9 WASM · APACHE-2.0", title: "VeilFactor", sub: "Zero-Knowledge Invoice Double-Pledge Prevention, Private Buyer Concentration Covenants & Auditor Selective Disclosure", cap: "6 Compiled Halo2 ZK Circuits (.prover/.verifier/.zkir) · 15/15 Contract Tests + 2/2 Web WASM Tests PASS", dur: 5.0),
    Slide(img: "\(framesDir)/01-pledge-double-attack.png", badge: "01 · ZERO-KNOWLEDGE INVOICE PLEDGE & ROGUE DOUBLE-PLEDGE BLOCKING", title: "Stops Duplicate Invoice Financing Across Competing Lenders — With Zero Leaks", sub: "Private witness checks credit score & concentration cap locally; deterministic nullifier blocks rogue wallet replay to Factor B", cap: "pledgeInvoice() -> REVERT: Double-pledge blocked · LEAKAGE AUDIT: 0/4 raw commercial secrets on Midnight ledger", dur: 10.0),
    Slide(img: "\(framesDir)/02-lifecycle-dealbook.png", badge: "02 · ROLE-AUTHENTICATED MULTI-PARTY FACTORING LIFECYCLE", title: "Factor ZK Authentication Across PLEDGED -> FUNDED -> SETTLED / DISPUTED", sub: "Impostor lender rejected inside Compact circuit; designated factor funds deal while spent nullifiers stay permanently locked", cap: "fundDeal() & settleDeal() verify domain-separated derived factorPk · Live Ledger-9 RunningCost telemetry", dur: 9.5),
    Slide(img: "\(framesDir)/03-auditor-disclosure.png", badge: "03 · REGULATOR & AUDITOR-SCOPED SELECTIVE DISCLOSURE", title: "Prove Exact Off-Chain Commercial Terms to Your Auditor — Never Competitors", sub: "Designated auditor verifies exact face value & credit score against on-chain disclosureSeal; +$1 tamper reverts in ZK", cap: "attestSelectiveDisclosure() updates disclosedToAuditor=true while publicly revealing 0 raw figures", dur: 9.5),
    Slide(img: "\(framesDir)/04-policy-circuits.png", badge: "04 · ADMIN RISK GOVERNANCE & 6-CIRCUIT VERIFICATION MATRIX", title: "Enforce Institutional Guardrails With Cryptographic Role Separation", sub: "Non-admin policy hijack rejected; all 6 circuits compiled via compact 0.36.1 (language_version 0.28.0) & verified in browser WASM", cap: "updateRiskPolicy() · 4 domain-separated roles (Admin / Supplier / Factor / Auditor) · Zero mock logic", dur: 9.0),
    Slide(img: "\(framesDir)/05-pitch-deck.png", badge: "05 · INTERACTIVE PITCH DECK & MIDNIGHT BUILD CLUB ROADMAP", title: "Built for Real $3T+ Trade Finance & RWA Credit Desks", sub: "Zero-setup interactive GitHub Pages console + printable 7-slide pitch deck + open-source Apache-2.0 repository", cap: "GitHub: z121245017-ai/veilfactor (topic: midnightntwrk) | Live App: z121245017-ai.github.io/veilfactor", dur: 8.0),
    Slide(img: nil, badge: "VEILFACTOR · MIDNIGHT NETWORK · APACHE LICENSE 2.0", title: "Global Uniqueness. Programmable Privacy.", sub: "6/6 Compact 0.36.1 Circuits Compiled · 15/15 Ledger-9 Tests · Live In-Browser WASM Prover", cap: "Live Demo: z121245017-ai.github.io/veilfactor  |  Deck: z121245017-ai.github.io/veilfactor/deck.html", dur: 5.0)
]

let w = 1280, h = 720, fps: Int32 = 30
func loadImg(_ p: String) -> CGImage? {
    guard let s = CGImageSourceCreateWithURL(URL(fileURLWithPath: p) as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(s, 0, nil)
}

let outURL = URL(fileURLWithPath: outVideo)
try? FileManager.default.removeItem(at: outURL)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: w, AVVideoHeightKey: h,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 2_600_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: 60]
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA), kCVPixelBufferWidthKey as String: w, kCVPixelBufferHeightKey as String: h
])
writer.add(input); writer.startWriting(); writer.startSession(atSourceTime: .zero)
guard let pool = adaptor.pixelBufferPool else { fatalError() }

func makePB(_ sl: Slide) -> CVPixelBuffer {
    var pbOut: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &pbOut)
    let pb = pbOut!
    CVPixelBufferLockBaseAddress(pb, []); defer { CVPixelBufferUnlockBaseAddress(pb, []) }
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb), width: w, height: h, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
    ctx.translateBy(x: 0, y: CGFloat(h)); ctx.scaleBy(x: 1, y: -1)
    ctx.setFillColor(NSColor(red: 0.027, green: 0.039, blue: 0.071, alpha: 1).cgColor)
    ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
    ctx.setFillColor(NSColor(red: 0.486, green: 0.424, blue: 0.965, alpha: 0.95).cgColor)
    ctx.fill(CGRect(x: 0, y: 0, width: w / 2, height: 4))
    ctx.setFillColor(NSColor(red: 0.133, green: 0.827, blue: 0.933, alpha: 0.95).cgColor)
    ctx.fill(CGRect(x: w / 2, y: 0, width: w / 2, height: 4))

    let cyan = NSColor(red: 0.404, green: 0.910, blue: 0.976, alpha: 1)
    let violet = NSColor(red: 0.647, green: 0.706, blue: 0.988, alpha: 1)
    let whiteSoft = NSColor(red: 0.93, green: 0.95, blue: 0.98, alpha: 1)
    let muted = NSColor(red: 0.58, green: 0.65, blue: 0.76, alpha: 1)

    if let p = sl.img, let cg = loadImg(p) {
        drawText(ctx, text: sl.badge, rect: CGRect(x: 40, y: 18, width: 1200, height: 22), fontSize: 13, weight: .bold, color: violet, mono: true)
        drawText(ctx, text: sl.title, rect: CGRect(x: 40, y: 42, width: 1200, height: 34), fontSize: 23, weight: .bold, color: whiteSoft)
        drawText(ctx, text: sl.sub, rect: CGRect(x: 50, y: 78, width: 1180, height: 26), fontSize: 14.2, weight: .regular, color: muted)

        let aspect = CGFloat(cg.width) / CGFloat(max(1, cg.height))
        let maxH: CGFloat = 516, maxW: CGFloat = 1140
        var dw = maxH * aspect, dh = maxH
        if dw > maxW { dw = maxW; dh = maxW / aspect }
        let fr = CGRect(x: (CGFloat(w) - dw) / 2, y: 114 + (maxH - dh) / 2, width: dw, height: dh)
        ctx.setStrokeColor(NSColor(red: 0.486, green: 0.424, blue: 0.965, alpha: 0.55).cgColor)
        ctx.setLineWidth(1.5); ctx.stroke(fr.insetBy(dx: -6, dy: -6))
        ctx.saveGState(); ctx.translateBy(x: fr.origin.x, y: fr.origin.y + fr.size.height); ctx.scaleBy(x: 1, y: -1)
        ctx.interpolationQuality = .high; ctx.draw(cg, in: CGRect(origin: .zero, size: fr.size)); ctx.restoreGState()

        ctx.setFillColor(NSColor(red: 0.055, green: 0.082, blue: 0.145, alpha: 1).cgColor)
        ctx.fill(CGRect(x: 40, y: 650, width: 1200, height: 48))
        ctx.setStrokeColor(NSColor(red: 0.133, green: 0.827, blue: 0.933, alpha: 0.55).cgColor)
        ctx.setLineWidth(1); ctx.stroke(CGRect(x: 40, y: 650, width: 1200, height: 48))
        drawText(ctx, text: sl.cap, rect: CGRect(x: 56, y: 663, width: 1168, height: 26), fontSize: 14.2, weight: .semibold, color: cyan, mono: true)
    } else {
        let box = CGRect(x: 90, y: 140, width: 1100, height: 440)
        ctx.setFillColor(NSColor(red: 0.051, green: 0.078, blue: 0.130, alpha: 1).cgColor); ctx.fill(box)
        ctx.setStrokeColor(NSColor(red: 0.133, green: 0.827, blue: 0.933, alpha: 0.65).cgColor); ctx.setLineWidth(2); ctx.stroke(box)
        drawText(ctx, text: sl.badge, rect: CGRect(x: 120, y: 196, width: 1040, height: 28), fontSize: 14.5, weight: .bold, color: violet, mono: true)
        drawText(ctx, text: sl.title, rect: CGRect(x: 120, y: 252, width: 1040, height: 76), fontSize: 56, weight: .bold, color: whiteSoft)
        drawText(ctx, text: sl.sub, rect: CGRect(x: 130, y: 348, width: 1020, height: 72), fontSize: 20.5, weight: .medium, color: muted)
        drawText(ctx, text: sl.cap, rect: CGRect(x: 120, y: 468, width: 1040, height: 44), fontSize: 15, weight: .semibold, color: cyan, mono: true)
    }
    return pb
}

var cur: Int64 = 0
for sl in slides {
    let pb = makePB(sl)
    let cnt = Int64(sl.dur * Double(fps))
    var off: Int64 = 0
    while off < cnt {
        while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
        adaptor.append(pb, withPresentationTime: CMTime(value: cur + off, timescale: fps))
        off += 15
    }
    cur += cnt
}
while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
adaptor.append(makePB(slides.last!), withPresentationTime: CMTime(value: cur, timescale: fps))
input.markAsFinished()
let sem = DispatchSemaphore(value: 0); writer.finishWriting { sem.signal() }; sem.wait()
let bytes = (try FileManager.default.attributesOfItem(atPath: outVideo)[.size] as? Int64) ?? 0
print(String(format: "Rendered video: %@ (%.1fs, %lld bytes)", outVideo, Double(cur)/Double(fps), bytes))
