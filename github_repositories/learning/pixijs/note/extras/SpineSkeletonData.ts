export type SkeletonData = {
	bones: Array<BoneData>
	slots: Array<SlotData>
	skins: Array<Skin>
	defaultSkin: Skin
	animations: Array<AnimationData>
}

export type BoneData = {
	name: string
	parent: BoneData
	length: number
	x: number
	y: number
	rotation: number
	scaleX: number
	scaleY: number
}

export type SlotData = {
	name: string
	boneData: BoneData
	attachmentName: string
	r: number
	g: number
	b: number
	a: number
}

export type RegionAttachment = {
	name: SlotData['attachmentName']
	width: number
	height: number
	x: number
	y: number
	rotation: number
	scaleX: number
	scaleY: number

	offset: Array<number>
	uvs: Array<number>

	rendererObject: null;
	regionOffsetX: number;
	regionOffsetY: number;
	regionWidth: number;
	regionHeight: number;
	regionOriginalWidth: number;
	regionOriginalHeight: number;
}
export type Skin = {
	name: string
	attachments: {
		// slotIndex + ":" + SlotData.attachmentName
		[key in string]: RegionAttachment
	}
}

export type Curves = {
	curves: Array<number>
}
export type RotateTimeline = {
	boneIndex: number
	curves: Curves
	frames: Array<number>
}
export type ScaleTimeline = {
	boneIndex: number
	curves: Curves
	frames: Array<number>
}
export type TranslateTimeline = {
	boneIndex: number
	curves: Curves
	frames: Array<number>
}
export type AnimationData = {
	name: string
	duration: number
	timelines: Array<RotateTimeline | ScaleTimeline | TranslateTimeline>
}