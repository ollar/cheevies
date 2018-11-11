export default function getGroupCheevies(group) {
    return group.get('cheevies').then(cheevies => cheevies.filter(c => !c.deleted));
}
