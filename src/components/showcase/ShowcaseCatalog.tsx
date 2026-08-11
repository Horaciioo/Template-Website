'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { Button } from '@/components/elements/actions/Button'
import { IconButton } from '@/components/elements/actions/IconButton'
import { Avatar } from '@/components/elements/data/Avatar'
import { Badge } from '@/components/elements/data/Badge'
import { ProgressBar } from '@/components/elements/data/ProgressBar'
import { StatTile } from '@/components/elements/data/StatTile'
import { Alert } from '@/components/elements/feedback/Alert'
import { EmptyState } from '@/components/elements/feedback/EmptyState'
import { PageSkeleton } from '@/components/elements/feedback/PageSkeleton'
import { Skeleton } from '@/components/elements/feedback/Skeleton'
import { Spinner } from '@/components/elements/feedback/Spinner'
import { FormRenderer } from '@/components/elements/forms/FormRenderer'
import { Breadcrumb } from '@/components/structures/navigation/Breadcrumb'
import { Pagination } from '@/components/structures/navigation/Pagination'
import { Tabs } from '@/components/structures/navigation/Tabs'
import { Accordion } from '@/components/structures/overlays/Accordion'
import { Drawer } from '@/components/structures/overlays/Drawer'
import { Modal } from '@/components/structures/overlays/Modal'
import { Tooltip } from '@/components/structures/overlays/Tooltip'
import { Card } from '@/components/structures/layout/Card'
import { Divider } from '@/components/structures/layout/Divider'
import { Grid } from '@/components/structures/layout/Grid'
import { Stack } from '@/components/structures/layout/Stack'
import { DataTable } from '@/components/structures/data/DataTable'
import { FilterBar } from '@/components/structures/data/FilterBar'
import { IconGrid } from '@/components/showcase/IconGrid'
import { ShowcaseBlock } from '@/components/showcase/ShowcaseBlock'
import { ThemePalette } from '@/components/showcase/ThemePalette'
import { TypographyScale } from '@/components/showcase/TypographyScale'
import { FAQ, PLACEHOLDER_IMAGE, STATS } from '@/declarations/content'
import { SIZES, TONES } from '@/declarations/ui/tokens'
import { BUTTON_VARIANTS } from '@/declarations/ui/variants'
import type { ButtonVariant } from '@/declarations/ui/variants'
import { FormatService } from '@/services/FormatService'
import { NavigationService } from '@/services/NavigationService'
import { NotificationService } from '@/services/NotificationService'
import { buildPaginationMeta } from '@/utils/array'

// Table demo rows
const TABLE_ROWS = STATS.map((stat) => ({
  id: stat.id,
  key: stat.translationKey,
  value: stat.value,
}))

/**
 * Design atlas
 * @return {JSX.Element} - Rendered atlas
 */

export const ShowcaseCatalog = () => {
  const t = useTranslations('showcase')
  const actions = useTranslations('actions')
  const feedback = useTranslations('feedback')
  const stats = useTranslations('sections.stats')
  const faq = useTranslations('sections.faq')
  const format = FormatService.for(useLocale())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [filterId, setFilterId] = useState(TONES[0] as string)

  return (
    <div className="flex flex-col gap-6">
      <ShowcaseBlock title={t('blocks.palette')} path="src/configurations/theme.json">
        <ThemePalette />
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.typography')} path="src/declarations/ui/variants.ts">
        <TypographyScale sample={t('sample')} />
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.icons')} path="src/declarations/ui/icons.ts">
        <IconGrid />
      </ShowcaseBlock>

      <ShowcaseBlock
        title={t('blocks.buttons')}
        path="src/components/elements/actions/Button.tsx"
        description={t('descriptions.buttons')}>
        <Stack gap="md" className="w-full">
          <Stack direction="horizontal" gap="sm" wrap>
            {(Object.keys(BUTTON_VARIANTS) as ButtonVariant[]).map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </Stack>
          <Stack direction="horizontal" gap="sm" wrap>
            {SIZES.map((size) => (
              <Button key={size} size={size} icon="sparkles">
                {size}
              </Button>
            ))}
            <Button loading>{actions('submit')}</Button>
            <Button disabled>{actions('cancel')}</Button>
            <IconButton icon="heart" label={actions('share')} />
            <ActionLink route="contact" variant="outline">
              {actions('contact')}
            </ActionLink>
          </Stack>
        </Stack>
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.badges')} path="src/components/elements/data/Badge.tsx">
        <Stack gap="sm" className="w-full">
          <Stack direction="horizontal" gap="sm" wrap>
            {TONES.map((tone) => (
              <Badge key={tone} tone={tone} icon="check">
                {tone}
              </Badge>
            ))}
          </Stack>
          <Stack direction="horizontal" gap="sm" wrap>
            {TONES.map((tone) => (
              <Badge key={tone} tone={tone} variant="outline">
                {tone}
              </Badge>
            ))}
          </Stack>
        </Stack>
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.alerts')} path="src/components/elements/feedback/Alert.tsx">
        <Stack gap="sm" className="w-full">
          {TONES.map((tone) => (
            <Alert key={tone} tone={tone} title={tone} description={t('sample')} />
          ))}
        </Stack>
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.data')} path="src/components/elements/data">
        <Grid columns={4} className="w-full">
          {STATS.map((stat) => (
            <StatTile
              key={stat.id}
              value={
                stat.format === 'percent'
                  ? format.percent(stat.value)
                  : format.number(stat.value, 0)
              }
              label={stats(`items.${stat.translationKey}.label`)}
              icon={stat.icon}
            />
          ))}
        </Grid>
        <Stack direction="horizontal" gap="md" align="center" wrap className="w-full">
          {SIZES.map((size) => (
            <Avatar key={size} name="Template Website" size={size} />
          ))}
          <Avatar name="Template Website" src={PLACEHOLDER_IMAGE} />
          <Spinner label={feedback('loading')} />
        </Stack>
        <ProgressBar value={0.68} label={feedback('loading')} className="w-full" />
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.overlays')} path="src/components/structures/overlays">
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          {t('blocks.modal')}
        </Button>
        <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
          {t('blocks.drawer')}
        </Button>
        <Tooltip label={t('sample')}>
          <Button variant="ghost">{t('blocks.tooltip')}</Button>
        </Tooltip>
        <Button variant="outline" onClick={() => NotificationService.success('feedback.saved')}>
          {t('blocks.notification')}
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          name="showcase-modal"
          title={t('blocks.modal')}
          closeLabel={actions('close')}
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                {actions('cancel')}
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>{actions('confirm')}</Button>
            </>
          }>
          {t('sample')}
        </Modal>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          name="showcase-drawer"
          title={t('blocks.drawer')}
          closeLabel={actions('close')}>
          {t('sample')}
        </Drawer>
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.navigation')} path="src/components/structures/navigation">
        <Stack gap="md" className="w-full">
          <Breadcrumb
            label={t('blocks.navigation')}
            entries={NavigationService.breadcrumbOf('showcase', (key) =>
              key.endsWith('home.label') ? actions('previous') : t('title')
            )}
          />
          <Tabs
            name="showcase-tabs"
            entries={TONES.slice(0, 3).map((tone) => ({
              id: tone,
              label: tone,
              content: <Alert tone={tone} title={tone} description={t('sample')} />,
            }))}
          />
          <Divider />
          <Pagination meta={buildPaginationMeta(48, page, 10)} onPageChange={setPage} />
        </Stack>
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.collections')} path="src/components/structures/data">
        <Stack gap="md" className="w-full">
          <FilterBar
            query={query}
            searchLabel={actions('search')}
            onQueryChange={setQuery}
            options={TONES.slice(0, 4).map((tone) => ({ id: tone, label: tone }))}
            activeId={filterId}
            onSelect={setFilterId}
          />
          <DataTable
            caption={t('blocks.collections')}
            columns={[
              {
                id: 'label',
                header: t('columns.label'),
                render: (row) => stats(`items.${row.key}.label`),
              },
              {
                id: 'value',
                header: t('columns.value'),
                align: 'right',
                render: (row) => format.number(row.value, 0),
              },
            ]}
            rows={TABLE_ROWS}
          />
          <Accordion
            name="showcase-accordion"
            entries={FAQ.slice(0, 3).map((item) => ({
              id: item.id,
              title: faq(`items.${item.translationKey}.question`),
              content: faq(`items.${item.translationKey}.answer`),
            }))}
          />
        </Stack>
      </ShowcaseBlock>

      <ShowcaseBlock title={t('blocks.placeholders')} path="src/components/elements/feedback">
        <Grid columns={2} className="w-full">
          <Card>
            <Skeleton shape="title" />
            <Skeleton shape="text" />
            <Skeleton shape="line" />
          </Card>
          <EmptyState
            variant="filter"
            figure="search"
            title={feedback('empty.title')}
            description={feedback('empty.description')}
            action={<Button variant="secondary">{actions('retry')}</Button>}
          />
        </Grid>
        <PageSkeleton blocks={[{ shape: 'row', rows: 2 }]} />
      </ShowcaseBlock>

      <ShowcaseBlock
        title={t('blocks.forms')}
        path="src/components/elements/forms/FormRenderer.tsx"
        description={t('descriptions.forms')}>
        <FormRenderer id="newsletter" className="w-full" />
      </ShowcaseBlock>
    </div>
  )
}
