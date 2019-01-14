export function userIsModerator(group, user) {
    const _group = group.serialize();
    const moderators = _group.moderators.length ? _group.moderators : _group.users.slice(0, 1);
    return moderators.indexOf(user.id) > -1;
}

export function userIsGroupAuthor(group, user) {
    const _group = group.serialize();
    // const author = _group.author ? _group.author : _group.users[0];
    return _group.author === user.id;
}
