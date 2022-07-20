import React from 'react';

const ChannelList = () => {
  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            const count = countList[`c-${channel.id}`];
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
                onClick={resetCount(`c-${channel.id}`)}
              >
                <span className={count !== undefined && count >= 0 ? 'bold' : undefined}># {channel.name}</span>
                {count !== undefined && count > 0 && <span className="count">{count}</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
