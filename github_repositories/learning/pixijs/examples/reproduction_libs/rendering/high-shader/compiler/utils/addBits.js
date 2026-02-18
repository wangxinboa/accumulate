function addBits(srcParts, parts, name) {
	if (srcParts) {
		for (const i in srcParts) {
			const id = i.toLocaleLowerCase();
			const part = parts[id];
			if (part) {
				let sanitisedPart = srcParts[i];
				if (i === "header") {
					sanitisedPart = sanitisedPart.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "");
				}
				if (name) {
					part.push(`//----${name}----//`);
				}
				part.push(sanitisedPart);
			} else {
				console.warn(`${i} placement hook does not exist in shader`);
			}
		}
	}
}

export { addBits };
