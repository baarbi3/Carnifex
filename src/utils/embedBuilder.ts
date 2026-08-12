import { ColorResolvable, EmbedBuilder } from "discord.js";

interface propsType {
  title: string;
  description: string;
  color?: ColorResolvable;
}

export function sendEmbed(props: propsType): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setTitle(props.title)
  .setDescription(props.description)
  .setColor(props.color || "Green")
  .setFooter({ text: new Date().toLocaleString() });

  return embed;
}