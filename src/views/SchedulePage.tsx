'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { format, parseISO } from 'date-fns';
import Chatbot from '../components/shared/Chatbot';
import PageHero from '../components/shared/PageHero';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import ScheduleFilter from '../components/schedule/ScheduleFilter';
import ScheduleTableView from '../components/schedule/ScheduleTableView';
import ScheduleCalendarView from '../components/schedule/ScheduleCalendarView';
import PersonalSchedulePanel from '../components/schedule/PersonalSchedulePanel';
import { CalendarValue, ViewType } from '../components/schedule/scheduleTypes';
import { filterSchedules } from '../components/schedule/scheduleUtils';
import { Schedule } from '../types';
import {
  useAvailableScheduleDates,
  usePersonalSchedules,
  useSchedulesByDate,
} from '@/hooks/useSchedules';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [personalSchedules, setPersonalSchedules] = useState<Schedule[]>([]);
  const [showPersonalSchedules, setShowPersonalSchedules] = useState(false);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [calendarValue, setCalendarValue] = useState<CalendarValue>(null);
  const [viewType, setViewType] = useState<ViewType>('table');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendarEvents, setShowCalendarEvents] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTutor, setFilterTutor] = useState('all');

  const {
    data: availableDates = [],
    isLoading: datesLoading,
    error: datesError,
  } = useAvailableScheduleDates();

  const {
    data: filteredSchedules = [],
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useSchedulesByDate(selectedDate);

  const personalSchedulesMutation = usePersonalSchedules();

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstDate = availableDates[0];
      setSelectedDate(firstDate);
      setCalendarValue(parseISO(firstDate));
    }
  }, [availableDates, selectedDate]);

  const availableTutors = useMemo(() => {
    if (filteredSchedules.length === 0) return [];
    return Array.from(new Set(filteredSchedules.map(s => s.tutorName))).filter(Boolean);
  }, [filteredSchedules]);

  const displaySchedules = useMemo(
    () => filterSchedules(filteredSchedules, searchKeyword, filterTutor),
    [filteredSchedules, searchKeyword, filterTutor]
  );

  const hasActiveFilters = searchKeyword !== '' || filterTutor !== 'all';
  const loading = datesLoading || (selectedDate ? schedulesLoading : datesLoading);
  const error =
    datesError?.message ||
    schedulesError?.message ||
    personalSchedulesMutation.error?.message ||
    null;

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleCalendarChange = useCallback((value: CalendarValue) => {
    setCalendarValue(value);
    if (value instanceof Date) {
      setSelectedDate(format(value, 'yyyy-MM-dd'));
    }
  }, []);

  const handlePhoneSubmit = useCallback(
    async (phone: string) => {
      const personalSchedulesData = await personalSchedulesMutation.mutateAsync(phone);
      setPersonalSchedules(personalSchedulesData);
      setShowPersonalSchedules(true);
      setPhoneSubmitted(true);
    },
    [personalSchedulesMutation]
  );

  const resetPersonalSchedules = useCallback(() => {
    setShowPersonalSchedules(false);
    setPersonalSchedules([]);
    setPhoneSubmitted(false);
    personalSchedulesMutation.reset();
  }, [personalSchedulesMutation]);

  const toggleView = useCallback((type: ViewType) => {
    setViewType(type);
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + (direction === 'prev' ? -1 : 1));
      return newMonth;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchKeyword('');
    setFilterTutor('all');
  }, []);

  const handleActiveStartDateChange = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  const toggleCalendarEvents = useCallback(() => {
    setShowCalendarEvents(prev => !prev);
  }, []);

  if (loading && !phoneSubmitted) {
    return (
      <Layout>
        <section className="bg-gray-100 dark:bg-gray-900 py-16">
          <div className="container-custom text-center">
            <SkeletonLoading type="text" count={2} className="mx-auto" />
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <SkeletonLoading type="text" count={1} className="w-1/3" />
              </div>
              <div className="mb-8 flex justify-between">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoading key={i} type="button" width="100px" />
                ))}
              </div>
              <div className="mb-8">
                <SkeletonLoading type="table-row" count={5} />
              </div>
            </div>
            <div>
              <div className="mb-6">
                <SkeletonLoading type="text" count={1} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <SkeletonLoading type="text" count={3} />
                <div className="mt-4">
                  <SkeletonLoading type="button" width="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        id="schedule-hero-heading"
        title="Lịch Học"
        subtitle="Xem lịch học các lớp và tra cứu lịch cá nhân"
      />

      <div className="container-custom py-12">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <SectionHeading title="Lịch học theo ngày" centered={false} />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => toggleView('table')}
                  className={`px-4 py-2 rounded ${viewType === 'table' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Dạng bảng
                </button>
                <button
                  type="button"
                  onClick={() => toggleView('calendar')}
                  className={`px-4 py-2 rounded ${viewType === 'calendar' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Lịch
                </button>
              </div>
            </div>

            <ScheduleFilter
              searchKeyword={searchKeyword}
              filterTutor={filterTutor}
              availableTutors={availableTutors}
              onSearchChange={setSearchKeyword}
              onTutorChange={setFilterTutor}
              onClearFilters={clearFilters}
            />

            {viewType === 'table' ? (
              <ScheduleTableView
                availableDates={availableDates}
                selectedDate={selectedDate}
                schedules={displaySchedules}
                hasActiveFilters={hasActiveFilters}
                onDateChange={handleDateChange}
                onClearFilters={clearFilters}
              />
            ) : (
              <ScheduleCalendarView
                calendarValue={calendarValue}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                availableDates={availableDates}
                displaySchedules={displaySchedules}
                tileSchedules={filteredSchedules}
                showCalendarEvents={showCalendarEvents}
                hasActiveFilters={hasActiveFilters}
                onCalendarChange={handleCalendarChange}
                onMonthChange={navigateMonth}
                onActiveStartDateChange={handleActiveStartDateChange}
                onToggleCalendarEvents={toggleCalendarEvents}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          <PersonalSchedulePanel
            loading={personalSchedulesMutation.isPending}
            showPersonalSchedules={showPersonalSchedules}
            personalSchedules={personalSchedules}
            onPhoneSubmit={handlePhoneSubmit}
            onReset={resetPersonalSchedules}
          />
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default SchedulePage;
