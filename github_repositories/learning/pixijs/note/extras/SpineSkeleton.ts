import type { SkeletonData, BoneData, SlotData, RegionAttachment } from './SpineSkeletonData.ts';


export type Skeleton = {
	data: SkeletonData
	bones: Array<Bone>
	slots: Array<Slot>
	drawOrder: Array<Slot>

	time: number

	x: number; y: number;
	skin: null;
	r: number; g: number; b: number; a: number;
	flipX: boolean; flipY: boolean;
}

export type Bone = {
	data: BoneData
	parent: Bone

	x: number
	y: number
	rotation: number
	scaleX: number
	scaleY: number

	m00: number; m01: number; worldX: number; // a b x
	m10: number; m11: number; worldY: number; // c d y
	worldRotation: number;
	worldScaleX: number; worldScaleY: number;
}

export type Slot = {
	data: SlotData
	skeleton: Skeleton
	bone: Bone
	attachment: RegionAttachment
	_attachmentTime: Skeleton['time']

	r: number; g: number; b: number; a: number;
}