export interface TwitterApiResponse {
  data: {
    communityResults: {
      result: {
        __typename: string;
        ranked_community_timeline: {
          timeline: {
            instructions: TwitterInstruction[];
            metadata: {
              scribeConfig: {
                page: string;
              };
            };
          };
        };
      };
    };
  };
}

type TwitterInstruction = TimelineAddEntriesInstruction | any;

interface TimelineAddEntriesInstruction {
  type: "TimelineAddEntries";
  entries: {
    entryId: string;
    sortIndex: string;
    content:
      | {
          entryType: "TimelineTimelineItem";
          __typename: "TimelineTimelineItem";
          itemContent: {
            itemType: "TimelineTweet";
            __typename: "TimelineTweet";
            tweet_results: {
              result: {
                __typename: "Tweet";
                core: {
                  user_results: {
                    result: {
                      __typename: "User";
                      avatar: {
                        image_url: string;
                      };
                      core: {
                        created_at: string;
                        name: string;
                        screen_name: string;
                      };
                    };
                  };
                };
                legacy: {
                  created_at: string;
                  full_text: string;
                  entities?: {
                    media: {
                      media_url_https: string;
                    }[];
                  };
                };
              };
            };
          };
        }
      | {
          entryType: "TimelineTimelineCursor";
          __typename: "TimelineTimelineCursor";
          value: string;
          cursorType: "Bottom";
        };
  }[];
}

export interface TwitterUser {
  avatar: string;
  name: string;
  username: string;
}

export interface TwitterPost {
  text: string;
  user: TwitterUser;
  createdAt: Date;
  media?: string[];
  url: string;
}

export const apiResponseToPosts = (
  response: TwitterApiResponse
): { posts: TwitterPost[]; cursor: string | null } => {
  let cursor: string | null = null;
  const posts: TwitterPost[] = [];
  const instructions =
    response.data.communityResults.result.ranked_community_timeline.timeline
      .instructions;
  for (const instruction of instructions) {
    if (instruction.type === "TimelineAddEntries") {
      for (const entry of instruction.entries) {
        if (
          entry.content?.entryType === "TimelineTimelineCursor" &&
          entry.content.cursorType === "Bottom"
        ) {
          cursor = entry.content.value;
          continue;
        }
        const tweet = entry.content?.itemContent?.tweet_results?.result;
        if (!tweet || tweet.__typename !== "Tweet") {
          continue;
        }
        const tweetId = entry.entryId.split("-").at(-1);
        const user = {
          avatar: tweet.core.user_results.result.avatar.image_url,
          name: tweet.core.user_results.result.core.name,
          username: tweet.core.user_results.result.core.screen_name,
        }
        posts.push({
          text: tweet.legacy.full_text,
          user,
          createdAt: new Date(tweet.legacy.created_at),
          media:
            tweet.legacy.entities?.media?.map(
              (media: { media_url_https?: string }) =>
                media.media_url_https ?? undefined
            ) ?? undefined,
          url: `https://x.com/${user.username}/status/${tweetId}`,
        });
      }
    }
  }
  return {
    posts: posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    cursor,
  };
};

export const parseCurlToApiRequest = (curl: string) => {
  const stringComponents = curl
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const urlString = stringComponents[0] ?? "";

  const urlStartIndex = urlString.indexOf("curl '") + 6;
  const urlEndIndex = urlString.indexOf("' \\");
  const url = urlString.slice(urlStartIndex, urlEndIndex).trim();

  const headerStrings = stringComponents
    .filter((headerString) => headerString.startsWith("-H"))
    .map((headerString) => {
      // find string between -H and :
      const headerStartIndex = headerString.indexOf("-H '") + 4;
      const headerEndIndex = headerString.indexOf("' \\");
      const header = headerString
        .slice(headerStartIndex, headerEndIndex)
        .trim();
      return header;
    })
    .filter(Boolean);

  const headers = headerStrings.reduce((acc, header) => {
    const splitIndex = header.indexOf(":");
    const key = header.slice(0, splitIndex).trim();
    const value = header.slice(splitIndex + 1).trim();
    if (key && value) {
      acc[key.trim()] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  return { url, headers };
};

export const parseUrlForCursor = (url: string) => {
  const startPhrase = "cursor%22%3A%22";
  const startIndex = url.indexOf(startPhrase) + startPhrase.length;

  const startHalf = url.slice(0, startIndex);
  const secondHalf = url.slice(startIndex);

  const endPhrase = "%22%2C%22";
  const cursorEndIndex = secondHalf.indexOf(endPhrase);

  const cursorText = secondHalf.slice(0, cursorEndIndex);
  const endHalf = secondHalf.slice(cursorEndIndex);

  return {
    startHalf,
    cursorText,
    endHalf,
  };
};

export const replaceCursor = (url: string, cursor: string | null) => {
  if (!cursor) return url;

  // https://x.com/i/api/graphql/LnWf7Lb9OEfyNcojf0VQQg/CommunityTweetsTimeline?variables=%7B%22communityId%22%3A%221493446837214187523%22%2C%22count%22%3A40%2C%22cursor%22%3A%22DAABCgABG4vzV6rAJxEKAAIbi_Mdf1bAawgAAwAAAAEAAA%22%2C%22displayLocation%22%3A%22Home%22%2C%22rankingMode%22%3A%22Recency%22%2C%22withCommunity%22%3Atrue%7D&features=%7B%22rweb_video_screen_enabled%22%3Afalse%2C%22payments_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22responsive_web_profile_redirect_enabled%22%3Afalse%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22premium_content_api_read_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22responsive_web_grok_analyze_button_fetch_trends_enabled%22%3Afalse%2C%22responsive_web_grok_analyze_post_followups_enabled%22%3Atrue%2C%22responsive_web_jetfuel_frame%22%3Atrue%2C%22responsive_web_grok_share_attachment_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22responsive_web_grok_show_grok_translated_post%22%3Afalse%2C%22responsive_web_grok_analysis_button_from_backend%22%3Atrue%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_grok_image_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_imagine_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_community_note_auto_translation_is_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D

  const { startHalf, endHalf } = parseUrlForCursor(url);

  return `${startHalf}${cursor}${endHalf}`;
};
