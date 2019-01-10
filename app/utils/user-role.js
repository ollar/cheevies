export function userIsModerator(group, user) {
    const _group = group.serialize();
    return _group.moderators.indexOf(user.id) > -1;
}

export function userIsGroupAuthor(group, user) {
    const _group = group.serialize();
    return _group.author === user.id;
}
