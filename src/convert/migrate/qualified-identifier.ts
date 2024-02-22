import * as t from "@babel/types";
import { inheritLocAndComments } from "../utils/common";
import {
  GlMatrixTypes,
  GeoJSONTypes,
  MapboxVectorTileTypes,
} from "../utils/type-mappings";

export function migrateQualifiedIdentifier(
  identifier: t.Identifier | t.QualifiedTypeIdentifier
): t.Identifier | t.TSQualifiedName {
  if (identifier.type === "Identifier") {

    // `Mat2` → `mat2`
    if (GlMatrixTypes[identifier.name as keyof typeof GlMatrixTypes]) {
      return t.identifier(GlMatrixTypes[identifier.name as keyof typeof GlMatrixTypes]);
    }

    // `GeoJSONFeature` -> `GeoJSON.Feature`
    if (GeoJSONTypes[identifier.name as keyof typeof GeoJSONTypes]) {
      return t.identifier(GeoJSONTypes[identifier.name as keyof typeof GeoJSONTypes]);
    }

    // `IVectorTile` -> `VectorTile`
    if (MapboxVectorTileTypes[identifier.name as keyof typeof MapboxVectorTileTypes]) {
      return t.identifier(MapboxVectorTileTypes[identifier.name as keyof typeof MapboxVectorTileTypes]);
    }

    return identifier;
  } else {
    const tsQualifiedName = t.tsQualifiedName(
      migrateQualifiedIdentifier(identifier.qualification),
      identifier.id
    );
    inheritLocAndComments(identifier.qualification, tsQualifiedName);
    return tsQualifiedName;
  }
}
