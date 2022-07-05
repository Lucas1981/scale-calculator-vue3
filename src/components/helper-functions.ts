export const generateDrawTextFn = (textOffsetX, textOffsetY, stepWidth, stepHeight) =>
  (ctx, note, i, j, color = 'white') => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "10px helvetica";
    ctx.fillText(
      note,
      textOffsetX + (i * stepWidth),
      textOffsetY + (j * stepHeight)
    );
    ctx.restore();
  }

export const findRelationToRoot = (note, root, scale) => {
  const rootIndex = scale.findIndex(value => value === root);
  const noteIndex = scale.findIndex(value => value === note);
  // compensate for when the root is higher than the note
  return rootIndex + (rootIndex < noteIndex ? scale.length : 0) - noteIndex;
}
