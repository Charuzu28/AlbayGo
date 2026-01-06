import { aiExplainRoute } from "../utils/aiExplainRoute";

const routeData =[
    from,
    to,
    steps,
    transport,
    estimatedTime
];

let explanation = null;

if(userAskedWhy || userIsTourist){
    explanation = await aiExplainRoute(routeData);
}

return res.json({
    route: routeData,
    explanation
})