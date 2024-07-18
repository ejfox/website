<template>
  <div>
    <h2>{{ scrap.title }}</h2>
    <p>{{ scrap.updated_at }}</p>
    <img :src="scrap.metadata.display.url" alt="Scrap Image" />
  </div>
</template>

<script setup>
const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

/* are.na scraps look like
{ "id": "ecd53c3f-259c-4ac7-8d12-ed29b89ff934", "source": "arena", "content": "computers\nwere a\nmistake\n\ncapitalism\nwas a\nmistake\n\n(it ruined\n\n4 computers)\n", "summary": null, "created_at": "2024-07-04T01:57:37.363", "updated_at": "2024-07-11T00:58:32.991", "tags": null, "relationships": [ { "type": "BELONGS_TO", "source": { "name": "grm36nbx0aay19s?format=png-name=900x900", "type": "Block" }, "target": { "name": "🌞 2024", "type": "Channel" } } ], "metadata": { "image": { "large": { "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIyOTIyMTg2Mi9vcmlnaW5hbF84MGFjZmJhN2I0YjYxY2UzMzRhMTQ3MTE0NDE1MDI2Yi5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjE4MDAsImhlaWdodCI6MTgwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo2NX0sImpwZWciOnsicXVhbGl0eSI6NjV9LCJyb3RhdGUiOm51bGx9fQ==?bc=0" }, "thumb": { "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIyOTIyMTg2Mi9vcmlnaW5hbF84MGFjZmJhN2I0YjYxY2UzMzRhMTQ3MTE0NDE1MDI2Yi5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6NjV9LCJqcGVnIjp7InF1YWxpdHkiOjY1fSwicm90YXRlIjpudWxsfX0=?bc=0" }, "square": { "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIyOTIyMTg2Mi9vcmlnaW5hbF84MGFjZmJhN2I0YjYxY2UzMzRhMTQ3MTE0NDE1MDI2Yi5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ0MCwiaGVpZ2h0Ijo0NDAsImZpdCI6ImNvdmVyIiwid2l0aG91dEVubGFyZ2VtZW50IjpmYWxzZX0sIndlYnAiOnsicXVhbGl0eSI6NjV9LCJqcGVnIjp7InF1YWxpdHkiOjY1fSwicm90YXRlIjpudWxsfX0=?bc=0" }, "display": { "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIyOTIyMTg2Mi9vcmlnaW5hbF84MGFjZmJhN2I0YjYxY2UzMzRhMTQ3MTE0NDE1MDI2Yi5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjEyMDAsImhlaWdodCI6MTIwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo2NX0sImpwZWciOnsicXVhbGl0eSI6NjV9LCJyb3RhdGUiOm51bGx9fQ==?bc=0" }, "filename": "80acfba7b4b61ce334a147114415026b.png", "original": { "url": "https://d2w9rnfcy7mm78.cloudfront.net/29221862/original_80acfba7b4b61ce334a147114415026b.png?1720058258?bc=0", "file_size": 455989, "file_size_display": "445 KB" }, "updated_at": "2024-07-04T01:57:38.483Z", "content_type": "image/png" }, "title": "grm36nbx0aay19s?format=png-name=900x900", "source": { "url": "https://x.com/parismarx/status/1808679699486331140/photo/1", "title": "Home / X", "provider": { "url": "https://pbs.twimg.com", "name": "https://pbs.twimg.com" } }, "description": "" }, "scrap_id": "A0kCnZFL", "embedding": null, "title": "grm36nbx0aay19s?format=png-name=900x900" }
 */
</script>

<style scoped></style>