import type { SkeletonData, AnimationData } from './SpineSkeletonData.ts';


export type AnimationStateData = {
	skeletonData: SkeletonData
	animationToMixTime: {
		// AnimationData.name + ":" + AnimationData.name
		[key in string]: number
	}
}

export type AnimationState = {
	data: AnimationStateData
	current: AnimationData
	currentLoop: boolean
	currentTime: number
}
