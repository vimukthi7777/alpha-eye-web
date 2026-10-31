import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { team, teamContactHref, teamPage } from "@/data";
import {
  ChevronLeftIcon,
  FacebookIcon,
  InstagramIcon,
  PhoneIcon,
  XIcon,
} from "@/components/ui/Icons";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return team.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const member = team.find((m) => m.id === id);
  return member
    ? { title: member.name, description: `${member.name}, ${member.role} at Alpha Eye Technologies.` }
    : {};
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = team.find((m) => m.id === id);
  if (!member) notFound();

  const socials = [
    { label: "Facebook", href: member.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: member.socials.instagram, Icon: InstagramIcon },
    { label: "X", href: member.socials.x, Icon: XIcon },
  ].filter((s) => s.href);

  return (
    <main id="main" className="pb-24 pt-32 lg:pt-40">
      <div className="container-grid items-center gap-y-10">
        <div className="col-span-12">
          <Link
            href="/team"
            className="glass btn-hover inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white"
          >
            <ChevronLeftIcon aria-hidden="true" className="h-4 w-4" />
            {teamPage.backLabel}
          </Link>
        </div>

        <div className="relative col-span-12 mx-auto aspect-[413/589] w-full max-w-sm overflow-hidden rounded-2xl md:col-span-5">
          <Image
            src="/images/team/ProfileCardBG.png"
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 24rem"
            className="object-cover"
          />
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role}`}
            width={752}
            height={828}
            priority
            sizes="(min-width: 768px) 27vw, 22rem"
            className="absolute left-[5%] top-[5%] h-auto w-[90%]"
          />
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <h1 className="text-[clamp(2.25rem,4.4vw,3.75rem)] font-semibold leading-tight tracking-tight text-white">
            {member.name}
          </h1>
          <p className="mt-2 text-accent">{member.role}</p>

          {member.bio && (
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/90">{member.bio}</p>
          )}

          <ul className="mt-6 list-disc space-y-1.5 pl-5 text-sm text-white marker:text-accent">
            {member.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={teamContactHref(member.id)}
              className="glass btn-hover flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold text-white"
            >
              <PhoneIcon aria-hidden="true" className="h-4 w-4" />
              {teamPage.contactLabel}
            </Link>
            <ul className="flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${label}`}
                    className="btn-hover flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-lg text-white"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
